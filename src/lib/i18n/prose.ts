import type { Locale } from "./config";

const MAP: Record<string, Record<Exclude<Locale, "ko">, string>> = {
  "돈의 이동이 큼. 투자보다 정산": {
    es: "Mucho movimiento de dinero: mejor liquidar que invertir a ciegas.",
    pl: "Duży ruch pieniędzy: lepiej rozliczać niż inwestować w ciemno.",
  },
  "수입 기회가 열리지만 지출도 같이 커짐": {
    es: "Se abre ingreso, pero el gasto crece a la vez.",
    pl: "Otwiera się przychód, ale wraz z nim rosną wydatki.",
  },
  "명예·직함이 돈보다 앞설 수 있음": {
    es: "Honor y cargo pueden ir por delante del dinero.",
    pl: "Honor i tytuł mogą iść przed pieniędzmi.",
  },
  "만들어 팔거나 성과급형 수입": {
    es: "Ingreso por crear, vender o comisión.",
    pl: "Przychód z tworzenia, sprzedaży lub prowizji.",
  },
  "자격·학습 투자가 훗날 현금이 됨": {
    es: "La inversión en título y estudio se vuelve efectivo más tarde.",
    pl: "Inwestycja w kwalifikacje i naukę później staje się gotówką.",
  },
  "현금흐름은 보통, 새는 곳부터 막을 해": {
    es: "Flujo normal: el año es para tapar fugas.",
    pl: "Przepływ przeciętny: rok na zatkanie wycieków.",
  },
  "승진, 평가, 직함, 책임 증가": {
    es: "Ascenso, evaluación, cargo, más responsabilidad.",
    pl: "Awans, ocena, stanowisko, więcej odpowiedzialności.",
  },
  "창작, 이직, 포트폴리오, 기술 업그레이드": {
    es: "Crear, cambiar de empleo, portafolio, mejorar técnica.",
    pl: "Twórczość, zmiana pracy, portfolio, podniesienie warsztatu.",
  },
  "공부, 자격, 연구, 문서 작업": {
    es: "Estudio, título, investigación, documentos.",
    pl: "Nauka, kwalifikacje, badania, dokumenty.",
  },
  "매출, 영업, 사업 확장": {
    es: "Ventas, comercial, ampliar el negocio.",
    pl: "Sprzedaż, handel, rozszerzenie biznesu.",
  },
  "자기 포지션을 다지는 구간": {
    es: "Tramo para asentar la propia posición.",
    pl: "Odcinek na utrwalenie własnej pozycji.",
  },
  "만남·약정·관계 공식화가 잘 보임": {
    es: "Se ven bien encuentros, pactos y formalizar la relación.",
    pl: "Dobrze widać spotkania, ustalenia i formalizację relacji.",
  },
  "감정을 말과 행동으로 밀어붙이기 쉬움": {
    es: "Fácil empujar el sentimiento con palabra y acto.",
    pl: "Łatwo pchać uczucie słowem i czynem.",
  },
  "돌봄과 의리는 커지지만 연애 밀도는 낮을 수 있음": {
    es: "Crecen cuidado y lealtad; la densidad romántica puede bajar.",
    pl: "Rosną troska i lojalność; gęstość romansu może spaść.",
  },
  "관계보다 자기 상태 정리가 먼저인 구간": {
    es: "Antes que la pareja, ordenar el propio estado.",
    pl: "Zanim relacja — uporządkować własny stan.",
  },
  "신경과 수면 관리가 필요": {
    es: "Hay que cuidar nervios y sueño.",
    pl: "Trzeba dbać o nerwy i sen.",
  },
  "리듬을 지키면 무난": {
    es: "Si se guarda el ritmo, el tramo es llevadero.",
    pl: "Gdy trzymasz rytm, odcinek jest znośny.",
  },
  "기존 관계가 재배치될 수 있음": {
    es: "Las relaciones de siempre pueden recolocarse.",
    pl: "Dotychczasowe relacje mogą się przestawić.",
  },
  "관계 확장보다 질 관리": {
    es: "Más calidad que ampliar el círculo.",
    pl: "Raczej jakość niż poszerzanie kręgu.",
  },
  "충이 겹치면 이동·이직을 한꺼번에 결정하지 말 것": {
    es: "Si hay choque, no decida mudanza y cambio de trabajo a la vez.",
    pl: "Przy zderzeniu nie decyduj naraz o przeprowadzce i zmianie pracy.",
  },
  "과신이 고착이 되지 않게": {
    es: "Que el exceso de confianza no se vuelva rígido.",
    pl: "Niech nadmierna pewność nie stwardnieje.",
  },
  "원국과 충이 겹쳐 변화가 커질 수 있는 해": {
    es: "Año de más cambio porque choca con la carta natal.",
    pl: "Rok większej zmiany, bo zderza się z kartą urodzenia.",
  },
};

export function prose(text: string, locale: Locale): string {
  if (locale === "ko") return text;
  return MAP[text]?.[locale] ?? text;
}
