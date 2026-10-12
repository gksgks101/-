import type { Locale } from "@/lib/i18n/config";
import { loc } from "./themeContext";

export interface GlossTerm {
  word: string;
  gloss: string;
}

export function gloss(locale: Locale, key: string, word: string): GlossTerm {
  const table: Record<string, Record<Locale, string>> = {
    일간: {
      ko: "나를 나타내는 천간. 성격의 뼈대입니다.",
      es: "El tronco diario: el hueso del carácter.",
      pl: "Pień dnia: kość charakteru.",
    },
    십성: {
      ko: "일간과 다른 글자의 관계. 말투·돈·책임의 채널입니다.",
      es: "Relación del tronco con otras letras: canal de habla, dinero, deber.",
      pl: "Relacja pnia z innymi znakami: kanał mowy, pieniędzy, obowiązku.",
    },
    용신: {
      ko: "이 사주를 돕는 오행. 색·방향·습관의 우선순위입니다.",
      es: "Elemento que ayuda a esta carta: prioridad de color, dirección y hábito.",
      pl: "Żywioł, który pomaga tej karcie: priorytet koloru, kierunku i nawyku.",
    },
    희신: {
      ko: "용신을 돕는 보조 오행입니다.",
      es: "Elemento auxiliar que sostiene el yongsin.",
      pl: "Żywioł pomocniczy podpierający yongsin.",
    },
    기신: {
      ko: "과하면 피곤한 오행입니다. 나쁜 색이 아닙니다.",
      es: "Elemento que cansa en exceso. No es ‘color malo’.",
      pl: "Żywioł, który męczy w nadmiarze. To nie „zły kolor”.",
    },
    신강: {
      ko: "일간이 센 편. 혼자 밀 수 있지만 과하면 고집입니다.",
      es: "Tronco bastante fuerte: puedes empujar solo, en exceso es terquedad.",
      pl: "Pień dość silny: możesz pchać sam, w nadmiarze to upór.",
    },
    신약: {
      ko: "일간이 약한 편. 도움과 회복이 실력의 일부입니다.",
      es: "Tronco más bien débil: la ayuda y el recobro son parte del oficio.",
      pl: "Pień raczej słaby: pomoc i odzysk to część warsztatu.",
    },
    격국: {
      ko: "월지가 가리키는 간판. 신강·용신과 맞아야 실제로 열립니다.",
      es: "El letrero del mes. Solo se abre si encaja con fuerza y yongsin.",
      pl: "Szyld miesiąca. Otwiera się, gdy pasuje do siły i yongsin.",
    },
    대운: {
      ko: "약 10년 단위의 기후입니다. 한 해 날씨(세운)와 다릅니다.",
      es: "Clima de unos 10 años. No es el tiempo de un solo año (seun).",
      pl: "Klimat ok. 10 lat. To nie pogoda jednego roku (seun).",
    },
    세운: {
      ko: "한 해의 날씨입니다. 원국 뼈대 위의 기후입니다.",
      es: "El tiempo de un año, encima del hueso natal.",
      pl: "Pogoda jednego roku na kości karty.",
    },
    식상: {
      ko: "표현·창작·말. 만들어서 보여주는 힘입니다.",
      es: "Expresión, creación, habla: fuerza de hacer y mostrar.",
      pl: "Wyraz, twórczość, mowa: siła robienia i pokazywania.",
    },
    재성: {
      ko: "돈·성과·현실. 벌고 지키는 채널입니다.",
      es: "Dinero, resultado, lo real: canal de ganar y guardar.",
      pl: "Pieniądze, wynik, realność: kanał zarabiania i trzymania.",
    },
    관성: {
      ko: "책임·평가·규칙. 역할이 보이는 힘입니다.",
      es: "Deber, evaluación, norma: fuerza de un rol visible.",
      pl: "Obowiązek, ocena, norma: siła widocznej roli.",
    },
    인성: {
      ko: "학습·보호·원칙. 준비하는 힘입니다.",
      es: "Estudio, amparo, principio: fuerza de preparar.",
      pl: "Nauka, osłona, zasada: siła przygotowania.",
    },
    비겁: {
      ko: "동료·경쟁·자립. 같이 가거나 나눠 쓰는 힘입니다.",
      es: "Colega, rivalidad, autonomía: ir juntos o compartir.",
      pl: "Kolega, rywalizacja, samodzielność: iść razem albo dzielić.",
    },
    배우자궁: {
      ko: "일지. 동거·배우자·자기 몸의 자리로 읽습니다.",
      es: "Rama del día: pareja, convivencia, el propio cuerpo.",
      pl: "Gałąź dnia: para, wspólne życie, własne ciało.",
    },
    "12운성": {
      ko: "일간이 지지에서 어느 계절인지. 관계의 리듬입니다.",
      es: "En qué ‘estación’ está el tronco en la rama: ritmo del vínculo.",
      pl: "W jakiej „porze” jest pień w gałęzi: rytm relacji.",
    },
  };
  return { word, gloss: table[key]?.[locale] ?? loc(locale, word, word, word) };
}
