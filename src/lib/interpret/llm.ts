import type { Locale } from "@/lib/i18n/config";
import { calculationToAiJson } from "@/lib/saju/engine";
import type { InterpretationReport, ReportSection, SajuCalculation } from "@/lib/saju/types";
import { buildRuleReport } from "./rules";

const SYSTEM = `너는 한국 전통 명리학의 구조적 해석을 수행하는 분석 엔진이다.

중요:
사용자가 입력한 생년월일을 보고 사주를 새로 계산하지 마라.
이미 계산된 JSON 데이터를 사실로 사용한다.
이름을 추측하거나 만들지 마라.

너의 역할은 계산된 명리 데이터를 일관된 규칙으로 해석하는 것이다.

해석 원칙:
1. 원국 우선
2. 월령 우선
3. 일간 강약 판단
4. 오행 균형
5. 십성 구조
6. 격국
7. 용희기신
8. 합충형파해
9. 신살
10. 대운
11. 세운

단 하나의 신살이나 단 하나의 오행만으로 인생을 결정하지 않는다.
좋은 말만 하지 않는다.
장점과 약점을 모두 설명한다.
미래를 확정적으로 단정하지 않는다.
"가능성이 높다", "주의가 필요하다", "이런 식으로 나타날 수 있다"처럼 확률적 표현을 사용한다.
사용자의 현실적인 행동 전략까지 제시한다.
의료/투자/법률을 확정 예측하지 마라.

반드시 JSON만 반환하라.
형식:
{
  "sections": [
    { "id": "summary", "title": "...", "paragraphs": ["..."], "bullets": ["..."] }
  ]
}

다음 id를 이 순서로 모두 포함하라:
summary, natal, lifetime, wealth, career, love, marriage, health, family, daeun, seun, advice, sinsal, guimun, roast, talent, turning
`;

const FREE_IDS = new Set(["summary", "natal", "character", "advice"]);

function withLocks(sections: ReportSection[]): ReportSection[] {
  return sections.map((item) => ({ ...item, locked: !FREE_IDS.has(item.id) }));
}

export async function interpretWithLlm(calculation: SajuCalculation, locale: Locale = "ko"): Promise<InterpretationReport> {
  const fallback = buildRuleReport(calculation);
  const language =
    locale === "es" ? "Responde en español." : locale === "pl" ? "Odpowiadaj po polsku." : "한국어로 답하라.";
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  if (!apiKey) return fallback;

  const payload = calculationToAiJson(calculation);
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `${SYSTEM}\n${language}` },
        {
          role: "user",
          content: `아래는 이미 계산이 끝난 사주 데이터다. 이 데이터를 변경하지 말고 명리학적 해석만 수행하라.\n\n${JSON.stringify(payload)}`,
        },
      ],
    }),
  });
  if (!response.ok) return fallback;
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return fallback;
  try {
    const parsed = JSON.parse(content) as { sections?: ReportSection[] };
    if (!parsed.sections?.length) return fallback;
    return {
      source: "llm",
      sections: withLocks(
        parsed.sections.map((item) => ({
          id: item.id,
          title: item.title,
          locked: false,
          paragraphs: item.paragraphs ?? [],
          bullets: item.bullets,
        })),
      ),
      disclaimer: fallback.disclaimer,
    };
  } catch {
    return fallback;
  }
}
