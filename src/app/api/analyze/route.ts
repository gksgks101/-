import { NextResponse } from "next/server";
import { interpretWithLlm } from "@/lib/interpret/llm";
import { buildRuleReport } from "@/lib/interpret/rules";
import { calculateSaju } from "@/lib/saju/engine";
import { birthInputSchema } from "@/lib/saju/schema";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = birthInputSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다.", details: parsed.error.flatten() }, { status: 400 });
    }
    const { unlockFull, useLlm, name, ...birth } = parsed.data;
    const calculation = calculateSaju({ ...birth, name });
    const report = useLlm ? await interpretWithLlm(calculation) : buildRuleReport(calculation);
    return NextResponse.json({
      calculation,
      report: {
        ...report,
        sections: report.sections.map((section) => (unlockFull ? { ...section, locked: false } : section)),
      },
      privacy: {
        nameUsedForDisplayOnly: true,
        birthDataSentToAi: false,
        stored: false,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "계산 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
