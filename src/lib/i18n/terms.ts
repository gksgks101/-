import type { Locale } from "./config";
import type { ElementKey } from "@/lib/saju/types";

export const ELEMENT_NAME: Record<Locale, Record<ElementKey, string>> = {
  ko: { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" },
  es: { wood: "Madera", fire: "Fuego", earth: "Tierra", metal: "Metal", water: "Agua" },
  pl: { wood: "Drewno", fire: "Ogień", earth: "Ziemia", metal: "Metal", water: "Woda" },
};

export const ELEMENT_COLOR: Record<ElementKey, string> = {
  wood: "#2f6b3a",
  fire: "#c43c28",
  earth: "#d4a017",
  metal: "#e8e0d0",
  water: "#1d4e89",
};

export const TEN_GOD_NAME: Record<string, Record<Locale, string>> = {
  비견: { ko: "비견", es: "Bi-gyeon (compañero)", pl: "Bigyeon (towarzysz)" },
  겁재: { ko: "겁재", es: "Geop-jae (rival)", pl: "Geopjae (rywal)" },
  식신: { ko: "식신", es: "Siksin (expresión)", pl: "Siksin (wyraz)" },
  상관: { ko: "상관", es: "Sang-gwan (talento)", pl: "Sangkwan (talent)" },
  편재: { ko: "편재", es: "Pyeon-jae (riqueza móvil)", pl: "Pyeonjae (ruchomy majątek)" },
  정재: { ko: "정재", es: "Jeong-jae (riqueza estable)", pl: "Jeongjae (stabilny majątek)" },
  편관: { ko: "편관", es: "Pyeon-gwan (presión/poder)", pl: "Pyeongwan (presja/władza)" },
  정관: { ko: "정관", es: "Jeong-gwan (cargo/norma)", pl: "Jeonggwan (urząd/norma)" },
  편인: { ko: "편인", es: "Pyeon-in (estudio irregular)", pl: "Pyeonin (nietypowa nauka)" },
  정인: { ko: "정인", es: "Jeong-in (apoyo/estudio)", pl: "Jeongin (wsparcie/nauka)" },
};

export const STRENGTH_NAME: Record<string, Record<Locale, string>> = {
  "강한 신강": { ko: "강한 신강", es: "Muy fuerte", pl: "Bardzo silny" },
  중강: { ko: "중강", es: "Bastante fuerte", pl: "Dość silny" },
  중화: { ko: "중화", es: "Equilibrado", pl: "Zrównoważony" },
  중약: { ko: "중약", es: "Algo débil", pl: "Raczej słaby" },
  "약한 신약": { ko: "약한 신약", es: "Muy débil", pl: "Bardzo słaby" },
};

export const POWER_LABEL: Record<string, Record<Locale, string>> = {
  강: { ko: "강", es: "fuerte", pl: "silny" },
  중: { ko: "중", es: "medio", pl: "średni" },
  약: { ko: "약", es: "débil", pl: "słaby" },
};

export const YIN_YANG_NAME: Record<"yang" | "yin", Record<Locale, string>> = {
  yang: { ko: "양", es: "yang", pl: "yang" },
  yin: { ko: "음", es: "yin", pl: "yin" },
};

export const GOD_GROUP_NAME: Record<string, Record<Locale, string>> = {
  비겁: { ko: "비겁", es: "compañeros (bi/geop)", pl: "towarzysze (bi/geop)" },
  식상: { ko: "식상", es: "expresión (sik/sang)", pl: "wyraz (sik/sang)" },
  재성: { ko: "재성", es: "riqueza (jae)", pl: "majątek (jae)" },
  관성: { ko: "관성", es: "autoridad (gwan)", pl: "autorytet (gwan)" },
  인성: { ko: "인성", es: "impronta (in)", pl: "pieczęć (in)" },
};

export const TWELVE_STAGE_NAME: Record<string, Record<Locale, string>> = {
  장생: { ko: "장생", es: "Changsheng (inicio)", pl: "Jangsaeng (początek)" },
  목욕: { ko: "목욕", es: "Muyu (baño/sensibilidad)", pl: "Mogyok (kąpiel/wrażliwość)" },
  관대: { ko: "관대", es: "Guandai (presentación)", pl: "Gwandae (prezentacja)" },
  건록: { ko: "건록", es: "Jianlu (autonomía)", pl: "Geollok (samodzielność)" },
  제왕: { ko: "제왕", es: "Diwang (apogeo)", pl: "Jewang (szczyt)" },
  쇠: { ko: "쇠", es: "Shuai (descenso)", pl: "Soe (zejście)" },
  병: { ko: "병", es: "Bing (revisión)", pl: "Byeong (przegląd)" },
  사: { ko: "사", es: "Si (cierre)", pl: "Sa (zamknięcie)" },
  묘: { ko: "묘", es: "Mu (retiro/almacén)", pl: "Myo (schowanie)" },
  절: { ko: "절", es: "Jue (corte/reset)", pl: "Jeol (cięcie/reset)" },
  태: { ko: "태", es: "Tai (gestación)", pl: "Tae (zaczyn)" },
  양: { ko: "양", es: "Yang (crianza)", pl: "Yang (hodowla)" },
};

export const GENDER_NAME: Record<"male" | "female", Record<Locale, string>> = {
  male: { ko: "남성", es: "Hombre", pl: "Mężczyzna" },
  female: { ko: "여성", es: "Mujer", pl: "Kobieta" },
};

export const PILLAR_NAME: Record<"year" | "month" | "day" | "hour", Record<Locale, string>> = {
  year: { ko: "년주", es: "Pilar del año", pl: "Filar roku" },
  month: { ko: "월주", es: "Pilar del mes", pl: "Filar miesiąca" },
  day: { ko: "일주", es: "Pilar del día", pl: "Filar dnia" },
  hour: { ko: "시주", es: "Pilar de la hora", pl: "Filar godziny" },
};

export const PLACE_NAME: Record<string, Record<Locale, string>> = {
  대한민국: { ko: "대한민국", es: "Corea del Sur", pl: "Korea Południowa" },
  일본: { ko: "일본", es: "Japón", pl: "Japonia" },
  중국: { ko: "중국", es: "China", pl: "Chiny" },
  미국: { ko: "미국", es: "Estados Unidos", pl: "Stany Zjednoczone" },
  영국: { ko: "영국", es: "Reino Unido", pl: "Wielka Brytania" },
  서울: { ko: "서울", es: "Seúl", pl: "Seul" },
  안산: { ko: "안산", es: "Ansan", pl: "Ansan" },
  수원: { ko: "수원", es: "Suwon", pl: "Suwon" },
  인천: { ko: "인천", es: "Incheon", pl: "Incheon" },
  부산: { ko: "부산", es: "Busán", pl: "Busan" },
  대구: { ko: "대구", es: "Daegu", pl: "Daegu" },
  대전: { ko: "대전", es: "Daejeon", pl: "Daejeon" },
  광주: { ko: "광주", es: "Gwangju", pl: "Gwangju" },
  울산: { ko: "울산", es: "Ulsan", pl: "Ulsan" },
  제주: { ko: "제주", es: "Jeju", pl: "Jeju" },
  춘천: { ko: "춘천", es: "Chuncheon", pl: "Chuncheon" },
  청주: { ko: "청주", es: "Cheongju", pl: "Cheongju" },
  전주: { ko: "전주", es: "Jeonju", pl: "Jeonju" },
  창원: { ko: "창원", es: "Changwon", pl: "Changwon" },
  도쿄: { ko: "도쿄", es: "Tokio", pl: "Tokio" },
  베이징: { ko: "베이징", es: "Pekín", pl: "Pekin" },
  상하이: { ko: "상하이", es: "Shanghái", pl: "Szanghaj" },
  뉴욕: { ko: "뉴욕", es: "Nueva York", pl: "Nowy Jork" },
  로스앤젤레스: { ko: "로스앤젤레스", es: "Los Ángeles", pl: "Los Angeles" },
  런던: { ko: "런던", es: "Londres", pl: "Londyn" },
};

export const WEALTH_TYPE: Record<string, Record<Locale, string>> = {
  월급형: { ko: "월급형", es: "Salario", pl: "Pensum / pensja" },
  사업형: { ko: "사업형", es: "Negocio propio", pl: "Własny biznes" },
  성과형: { ko: "성과형", es: "Por resultados", pl: "Za wyniki" },
  전문직형: { ko: "전문직형", es: "Profesión especializada", pl: "Zawód specjalistyczny" },
  투자형: { ko: "투자형", es: "Inversión / oportunidad", pl: "Inwestycje / okazje" },
  축적형: { ko: "축적형", es: "Acumulación", pl: "Gromadzenie" },
  영업형: { ko: "영업형", es: "Ventas", pl: "Sprzedaż" },
  콘텐츠형: { ko: "콘텐츠형", es: "Creación de contenidos", pl: "Tworzenie treści" },
};

export const CAREER_TYPE: Record<string, Record<Locale, string>> = {
  조직형: { ko: "조직형", es: "Organización", pl: "Organizacja" },
  공무원형: { ko: "공무원형", es: "Función pública", pl: "Służba publiczna" },
  전문직형: { ko: "전문직형", es: "Profesión", pl: "Profesja" },
  기술직형: { ko: "기술직형", es: "Técnica", pl: "Technika" },
  창업형: { ko: "창업형", es: "Emprendimiento", pl: "Przedsiębiorczość" },
  기획형: { ko: "기획형", es: "Planificación", pl: "Planowanie" },
  영업형: { ko: "영업형", es: "Ventas", pl: "Sprzedaż" },
  연구형: { ko: "연구형", es: "Investigación", pl: "Badania" },
  콘텐츠형: { ko: "콘텐츠형", es: "Contenidos", pl: "Treści" },
  투자형: { ko: "투자형", es: "Inversión", pl: "Inwestycje" },
};

export function term(table: Record<string, Record<Locale, string>>, value: string, locale: Locale): string {
  return table[value]?.[locale] ?? value;
}

export function placeName(value: string, locale: Locale): string {
  return PLACE_NAME[value]?.[locale] ?? value;
}

export function tenGod(value: string, locale: Locale): string {
  return TEN_GOD_NAME[value]?.[locale] ?? value;
}
