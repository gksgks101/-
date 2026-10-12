import type { Locale } from "@/lib/i18n/config";
import type { ElementKey, TypeScore } from "@/lib/saju/types";
import { loc, type ThemeCtx } from "./themeContext";

export interface RankedJob {
  rank: number;
  name: string;
  saju: string;
  easy: string;
}

const JOBS: Record<string, Record<Locale, string[]>> = {
  조직형: {
    ko: ["인사담당자", "프로젝트 매니저", "호텔리어", "행정사무원", "팀 코디네이터"],
    es: ["responsable de personal", "jefe de proyecto", "hotelero", "administrativo", "coordinador de equipo"],
    pl: ["specjalista ds. kadr", "kierownik projektu", "hotelerz", "pracownik administracji", "koordynator zespołu"],
  },
  공무원형: {
    ko: ["경찰관", "소방관", "세무공무원", "교사", "사회복지사"],
    es: ["policía", "bombero", "inspector fiscal", "docente", "trabajador social"],
    pl: ["policjant", "strażak", "urzędnik skarbowy", "nauczyciel", "pracownik socjalny"],
  },
  전문직형: {
    ko: ["변호사", "회계사", "약사", "노무사", "변리사"],
    es: ["abogado", "contador", "farmacéutico", "asesor laboral", "agente de patentes"],
    pl: ["adwokat", "księgowy", "farmaceuta", "doradca kadrowy", "rzecznik patentowy"],
  },
  기술직형: {
    ko: ["소프트웨어 개발자", "기계기술자", "전기기사", "건축기사", "데이터 엔지니어"],
    es: ["desarrollador de software", "técnico mecánico", "electricista titulado", "arquitecto técnico", "ingeniero de datos"],
    pl: ["programista", "technik mechanik", "elektryk z uprawnieniami", "technik architekt", "inżynier danych"],
  },
  창업형: {
    ko: ["자영업자", "스타트업 창업자", "공방 대표", "독립 컨설턴트", "프랜차이즈 점주"],
    es: ["autónomo", "fundador de startup", "dueño de taller", "consultor independiente", "franquiciado"],
    pl: ["osoba samozatrudniona", "założyciel startupu", "właściciel pracowni", "niezależny konsultant", "franczyzobiorca"],
  },
  기획형: {
    ko: ["서비스 기획자", "브랜드 매니저", "UX 기획자", "정책 기획관", "콘텐츠 기획자"],
    es: ["planificador de servicio", "brand manager", "planificador UX", "analista de políticas", "planificador de contenidos"],
    pl: ["planista usług", "brand manager", "planista UX", "analityk polityk publicznych", "planista treści"],
  },
  영업형: {
    ko: ["제약 영업사원", "부동산 중개인", "해외영업 사원", "보험설계사", "고객성공 매니저"],
    es: ["visitador médico", "agente inmobiliario", "comercial de exportación", "asesor de seguros", "customer success"],
    pl: ["przedstawiciel farmaceutyczny", "pośrednik nieruchomości", "handlowiec eksportu", "doradca ubezpieczeniowy", "opiekun klienta"],
  },
  연구형: {
    ko: ["연구원", "데이터 분석가", "대학교수", "임상연구 코디네이터", "시장조사원"],
    es: ["investigador", "analista de datos", "profesor universitario", "coordinador de ensayo clínico", "analista de mercado"],
    pl: ["badacz", "analityk danych", "wykładowca akademicki", "koordynator badań klinicznych", "analityk rynku"],
  },
  콘텐츠형: {
    ko: ["디자이너", "영상 편집자", "작가", "광고 카피라이터", "뮤지션"],
    es: ["diseñador", "editor de vídeo", "escritor", "copywriter", "músico"],
    pl: ["projektant", "montażysta wideo", "pisarz", "copywriter", "muzyk"],
  },
  투자형: {
    ko: ["금융분석가", "재무분석가", "리스크 관리자", "부동산 감정평가사", "펀드 운용 보조"],
    es: ["analista financiero", "analista de finanzas", "gestor de riesgos", "tasador inmobiliario", "asistente de fondos"],
    pl: ["analityk finansowy", "analityk finansów", "specjalista ryzyka", "rzeczoznawca majątkowy", "asystent funduszu"],
  },
};

const JOB_WHY: Record<string, Record<Locale, { saju: string; easy: string }>> = {
  조직형: {
    ko: { saju: "관성·비겁이 사람과 규칙을 같이 다루는 자리", easy: "역할이 보이면 오래 가고, 혼자 다 만들려 하면 지쳐요." },
    es: { saju: "Autoridad y compañeros: gente y normas a la vez", easy: "Si el rol se ve, duras; si lo haces todo solo, te cansas." },
    pl: { saju: "Autorytet i towarzysze: ludzie i zasady naraz", easy: "Gdy widać rolę — wytrzymasz; jak wszystko sam — zmęczysz się." },
  },
  공무원형: {
    ko: { saju: "정관·인성이 시험·규율·공적 책임을 받침", easy: "절차가 있는 판에서 신뢰가 쌓여요. 즉흥 사업은 체질이 아니에요." },
    es: { saju: "Cargo estable e impronta: examen, norma, deber público", easy: "En un tablero con procedimiento se acumula fe. El negocio improvisado no es tu cuerpo." },
    pl: { saju: "Urząd i pieczęć: egzamin, norma, obowiązek publiczny", easy: "Na planszy z procedurą rośnie zaufanie. Improwizowany biznes to nie twoja budowa." },
  },
  전문직형: {
    ko: { saju: "인성+식상이 자격과 기술로 단가를 만듦", easy: "깊이 있는 한 분야가 수입이 돼요. 잡무가 전문을 삼키지 않게 하세요." },
    es: { saju: "Impronta y expresión: el título marca la tarifa", easy: "Un oficio hondo se vuelve ingreso. Que lo extra no trague lo experto." },
    pl: { saju: "Pieczęć i wyraz: kwalifikacja ustala stawkę", easy: "Głęboki fach staje się przychodem. Niech chałtura nie pożre specjalności." },
  },
  기술직형: {
    ko: { saju: "식상·금/수의 손기술·시스템이 결과로 남음", easy: "손으로, 코드로, 도면으로 남는 일이 맞아요. 말만 많은 회의는 줄이세요." },
    es: { saju: "Expresión y sistema: queda en la mano, el código, el plano", easy: "Te sienta lo que queda hecho. Recorta las juntas de solo hablar." },
    pl: { saju: "Wyraz i system: zostaje w ręku, kodzie, rysunku", easy: "Pasuje to, co zostaje zrobione. Tnij zebrania z samą gadką." },
  },
  창업형: {
    ko: { saju: "식상생재·편재가 내 이름으로 현금 흐름을 만듦", easy: "만들어 보여주는 쪽이 연료예요. 지시만 받는 자리는 금방 답답해져요." },
    es: { saju: "Expresión→riqueza: el flujo lleva tu nombre", easy: "Crear y mostrar es el combustible. Un puesto solo de órdenes te ahoga." },
    pl: { saju: "Wyraz→majątek: przepływ z twoim nazwiskiem", easy: "Tworzenie i pokazywanie to paliwo. Samo wykonywanie poleceń dusi." },
  },
  기획형: {
    ko: { saju: "인성·식상이 읽고 설계하고 판을 짬", easy: "판을 짜는 자리가 맞아요. 실행 파트너가 없으면 기획만 쌓여요." },
    es: { saju: "Impronta y expresión: leer, diseñar, armar el tablero", easy: "Te sienta armar el plan. Sin socio de ejecución, solo se apila el papel." },
    pl: { saju: "Pieczęć i wyraz: czytać, projektować, stawiać planszę", easy: "Pasuje układanie planu. Bez partnera wykonania — sterta papieru." },
  },
  영업형: {
    ko: { saju: "상관·편재가 사람과 숫자를 동시에 움직임", easy: "사람과 숫자를 같이 움직이는 자리예요. 거절을 개인 거절로 듣지 마세요." },
    es: { saju: "Talento y riqueza móvil: gente y cifras a la vez", easy: "Mueves personas y números. No oigas el no como rechazo personal." },
    pl: { saju: "Talent i ruchomy majątek: ludzie i cyfry naraz", easy: "Ruszasz ludzi i liczby. Nie słuchaj „nie” jako osobistej odmowy." },
  },
  연구형: {
    ko: { saju: "인성이 깊게 파는 시간을 자산으로 만듦", easy: "혼자 읽는 오전이 근무의 일부여야 해요. 창구형 응대만 하면 방전돼요." },
    es: { saju: "La impronta convierte la hondura en activo", easy: "Una mañana de lectura debe ser parte del trabajo. Solo atender gente te vacía." },
    pl: { saju: "Pieczęć zamienia głębię w aktyw", easy: "Poranek czytania ma być częścią etatu. Samo okienko ludzi cię opróżnia." },
  },
  콘텐츠형: {
    ko: { saju: "식상·화가 작품이 남는 채널을 원함", easy: "만들고 알리는 리듬이 직업이 돼요. 매일 사람만 상대하는 창구는 오래 못 가요." },
    es: { saju: "Expresión y fuego: un canal con obra", easy: "Crear y publicar se vuelve oficio. Una ventanilla de gente todo el día no dura." },
    pl: { saju: "Wyraz i ogień: kanał z dziełem", easy: "Tworzenie i publikacja stają się fachem. Okienko ludzi przez cały dzień nie wytrzyma." },
  },
  투자형: {
    ko: { saju: "편재·식상이 기회와 리스크를 숫자로 읽음", easy: "기회 감각은 자산이에요. 한 번에 올인하지 말고 한도와 정산부터 정하세요." },
    es: { saju: "Riqueza móvil y expresión: lee oportunidad y riesgo en cifras", easy: "El olfato es activo. No all-in: primero techo y liquidación." },
    pl: { saju: "Ruchomy majątek i wyraz: czyta okazję i ryzyko w liczbach", easy: "Węch to aktyw. Nie all-in: najpierw limit i rozliczenie." },
  },
};

export function rankedJobs(types: TypeScore[], locale: Locale): RankedJob[] {
  const ranked: RankedJob[] = [];
  const used = new Set<string>();
  for (const item of types) {
    const names = JOBS[item.type]?.[locale] ?? [];
    const why = JOB_WHY[item.type]?.[locale];
    for (const name of names) {
      if (used.has(name)) continue;
      used.add(name);
      ranked.push({
        rank: ranked.length + 1,
        name,
        saju: why?.saju ?? item.reasons[0] ?? "",
        easy: why?.easy ?? "",
      });
      if (ranked.length >= 5) return ranked;
    }
  }
  return ranked;
}

export function unfitJobs(types: TypeScore[], locale: Locale): { name: string; why: string }[] {
  const bottom = [...types].slice(-3).reverse();
  return bottom.map((item) => {
    const name = JOBS[item.type]?.[locale]?.[0] ?? item.type;
    return {
      name,
      why: loc(
        locale,
        `${item.type} 점수가 낮아 ${name} 리듬과 원국이 어긋납니다.`,
        `La puntuación de este tipo es baja: el ritmo de ${name} no encaja con tu carta.`,
        `Niski wynik tego typu: rytm „${name}” nie zgadza się z kartą.`,
      ),
    };
  });
}

export function workEnv(type: string | undefined, locale: Locale): { env: string; style: string; tip: string } {
  const table: Record<string, Record<Locale, { env: string; style: string; tip: string }>> = {
    창업형: {
      ko: { env: "잘 맞는 환경: 창업 · 프리랜서", style: "만들어 보여주고, 내 이름으로 남는 일", tip: "마감과 정산을 달력에 먼저 박으세요." },
      es: { env: "Entorno: emprender o freelance", style: "Crear, mostrar, dejar obra con tu nombre", tip: "Fija plazo y liquidación en el calendario primero." },
      pl: { env: "Środowisko: własna firma albo freelance", style: "Tworzyć, pokazywać, zostawiać dzieło z nazwiskiem", tip: "Najpierw wpisz deadline i rozliczenie w kalendarz." },
    },
    콘텐츠형: {
      ko: { env: "잘 맞는 환경: 프리랜서 · 스튜디오", style: "만들고 알리는 리듬", tip: "매일 창구 응대보다 작품이 남는 채널을 고르세요." },
      es: { env: "Entorno: freelance o estudio", style: "Crear y publicar", tip: "Elige un canal con obra, no una ventanilla de gente." },
      pl: { env: "Środowisko: freelance albo studio", style: "Tworzyć i publikować", tip: "Wybierz kanał z dziełem, nie okienko ludzi." },
    },
    연구형: {
      ko: { env: "잘 맞는 환경: 연구소 · 전문 조직", style: "깊게 파고, 혼자 읽는 오전이 필요", tip: "사람만 상대하는 날을 주 2회로 제한하세요." },
      es: { env: "Entorno: laboratorio u organización experta", style: "Profundizar; necesita una mañana a solas", tip: "Limita a dos días por semana el trato solo de gente." },
      pl: { env: "Środowisko: laboratorium albo organizacja ekspercka", style: "Kopać w głąb; potrzebny samotny poranek", tip: "Ogranicz do dwóch dni w tygodniu samo obcowanie z ludźmi." },
    },
    공무원형: {
      ko: { env: "잘 맞는 환경: 조직 · 공공", style: "절차와 기록이 있는 일", tip: "즉흥 사업을 곁다리로 두지 마세요." },
      es: { env: "Entorno: organización o lo público", style: "Oficio con procedimiento y registro", tip: "No pongas un negocio improvisado de extra." },
      pl: { env: "Środowisko: organizacja albo sektor publiczny", style: "Praca z procedurą i zapisem", tip: "Nie dokładaj z boku improwizowanego biznesu." },
    },
    조직형: {
      ko: { env: "잘 맞는 환경: 조직", style: "역할이 나뉜 팀", tip: "혼자 다 쥐지 말고, 위임 한 줄을 만드세요." },
      es: { env: "Entorno: organización", style: "Equipo con roles partidos", tip: "No lo agarres todo: deja una línea de delegación." },
      pl: { env: "Środowisko: organizacja", style: "Zespół z podzielonymi rolami", tip: "Nie chwytaj wszystkiego: zostaw linijkę delegowania." },
    },
  };
  return (
    table[type ?? ""]?.[locale] ?? {
      ko: { env: "잘 맞는 환경: 역할이 분명한 조직 또는 소수 팀", style: "프로젝트 하나, 마감 하나", tip: "내가 책임지는 덩어리가 보이면 속도가 나요." },
      es: { env: "Entorno: organización con rol claro o equipo chico", style: "Un proyecto, un plazo", tip: "Si se ve el bloque tuyo, sale velocidad." },
      pl: { env: "Środowisko: organizacja z jasną rolą albo mały zespół", style: "Jeden projekt, jeden deadline", tip: "Gdy widać twój kawałek — idzie tempo." },
    }[locale]
  );
}

const FASHION: Record<ElementKey, Record<Locale, { style: string; color: string; fabric: string; acc: string; avoid: string }>> = {
  wood: {
    ko: { style: "세로 실루엣, 자연스러운 레이어", color: "청록·연두·나무갈색", fabric: "린넨, 면, 니트", acc: "나무 구슬, 천 밴드", avoid: "너무 꽉 끼는 검정 슈트만의 반복" },
    es: { style: "Silueta vertical, capas naturales", color: "Verde bosque, lima, marrón madera", fabric: "Lino, algodón, punto", acc: "Cuentas de madera, cinta de tela", avoid: "Solo el traje negro ceñido, una y otra vez" },
    pl: { style: "Pionowa sylwetka, naturalne warstwy", color: "Leśna zieleń, limonka, brąz drewna", fabric: "Len, bawełna, dzianina", acc: "Koraliki drewniane, taśma materiałowa", avoid: "Samo obcisłe czarne garnitury w kółko" },
  },
  fire: {
    ko: { style: "포인트 컬러가 있는 단정한 옷", color: "주홍·진홍·자색 포인트", fabric: "따뜻한 울, 실크 혼방", acc: "작은 레드 스카프, 브로치", avoid: "머리부터 발끝까지 빨강" },
    es: { style: "Corte limpio con un acento de color", color: "Cinabrio, rojo, púrpura de acento", fabric: "Lana tibia, mezcla de seda", acc: "Pañuelo rojo chico, broche", avoid: "Rojo de pies a cabeza" },
    pl: { style: "Czysty krój z jednym akcentem koloru", color: "Cynober, czerwień, purpura jako akcent", fabric: "Ciepła wełna, mieszanka jedwabiu", acc: "Mała czerwona chusta, broszka", avoid: "Czerwień od stóp do głów" },
  },
  earth: {
    ko: { style: "부드러운 둥근 실루엣, 안정감 있는 핏", color: "베이지·황토·카멜", fabric: "코듀로이, 면, 니트", acc: "도자기 단추, 가죽 벨트", avoid: "너무 차가운 네온과 찢어진 데님만" },
    es: { style: "Silueta redonda, calce estable", color: "Beige, ocre, camel", fabric: "Pana, algodón, punto", acc: "Botón de cerámica, cinturón de cuero", avoid: "Solo neón frío y denim roto" },
    pl: { style: "Okrągła sylwetka, stabilny fason", color: "Beż, ochra, camel", fabric: "Sztruks, bawełna, dzianina", acc: "Guzik ceramiczny, skórzany pasek", avoid: "Samo zimne neon i podarte denimy" },
  },
  metal: {
    ko: { style: "깨끗한 라인, 여백 있는 미니멀", color: "한지 흰빛·은색·네이비 포인트", fabric: "면 옥스퍼드, 울 개버딘", acc: "작은 금속 시계, 심플 링", avoid: "과도한 로고와 찢어진 장식" },
    es: { style: "Línea limpia, minimal con aire", color: "Blanco hanji, plata, acento marino", fabric: "Oxford de algodón, gabardina de lana", acc: "Reloj de metal chico, anillo simple", avoid: "Logos de más y rotos decorativos" },
    pl: { style: "Czysta linia, minimal z oddechem", color: "Biel hanji, srebro, granatowy akcent", fabric: "Bawełniany oxford, wełniana gabardyna", acc: "Mały metalowy zegarek, prosta obrączka", avoid: "Nadmiar logo i ozdobne przetarcia" },
  },
  water: {
    ko: { style: "흐르는 실루엣, 레이어드 코트", color: "남색·회청·먹색", fabric: "실크, 레이온, 부드러운 니트", acc: "긴 스카프, 어두운 스톤", avoid: "각진 형광 스포츠웨어만" },
    es: { style: "Silueta que fluye, abrigo en capas", color: "Índigo, azul gris, tinta", fabric: "Seda, rayón, punto suave", acc: "Bufanda larga, piedra oscura", avoid: "Solo ropa sport flúor y angulosa" },
    pl: { style: "Płynąca sylwetka, płaszcz warstwowy", color: "Granat, szaroniebieski, tusz", fabric: "Jedwab, wiskoza, miękka dzianina", acc: "Długi szal, ciemny kamień", avoid: "Sama kanciasta fluorescencyjna odzież sportowa" },
  },
};

const FOOD: Record<ElementKey, Record<Locale, { help: string; cut: string; tea: string }>> = {
  wood: {
    ko: { help: "새콤한 채소, 새싹, 신맛 과일", cut: "기름진 튀김과 과한 술", tea: "국화차, 민트차" },
    es: { help: "Verdura ácida, brotes, fruta con ácido", cut: "Fritos grasos y alcohol de más", tea: "Crisantemo, menta" },
    pl: { help: "Kwaśne warzywa, kiełki, owoc z kwasem", cut: "Tłuste smażone i nadmiar alkoholu", tea: "Chryzantema, mięta" },
  },
  fire: {
    ko: { help: "약간 쓴맛, 붉은 과일, 따뜻한 국", cut: "매운 야식과 카페인 과다", tea: "구기자차, 히비스커스" },
    es: { help: "Un toque amargo, fruta roja, caldo tibio", cut: "Cena picante y cafeína de más", tea: "Goji, hibisco" },
    pl: { help: "Lekka gorycz, czerwony owoc, ciepły rosół", cut: "Ostra kolacja i nadmiar kofeiny", tea: "Goji, hibiskus" },
  },
  earth: {
    ko: { help: "담백한 곡물, 호박, 따뜻한 스튜", cut: "찬 음료와 당 많은 간식", tea: "생강차, 대추차" },
    es: { help: "Cereal suave, calabaza, estofado tibio", cut: "Bebida fría y snack muy dulce", tea: "Jengibre, azufaifo" },
    pl: { help: "Łagodne zboże, dynia, ciepły gulasz", cut: "Zimny napój i bardzo słodka przekąska", tea: "Imbir, jujuba" },
  },
  metal: {
    ko: { help: "흰 음식·담백한 뿌리, 배, 도라지", cut: "매캐한 연기와 과한 매운맛", tea: "배도라지차, 은단차" },
    es: { help: "Comida blanca y raíz suave, pera, campanilla", cut: "Humo acre y picante de más", tea: "Pera y platycodon, té de menta suave" },
    pl: { help: "Białe jedzenie i łagodny korzeń, gruszka, dzwonek", cut: "Ostry dym i nadmiar pikanterii", tea: "Gruszka z platycodonem, łagodna mięta" },
  },
  water: {
    ko: { help: "검은깨·해조류·담백한 국물", cut: "과한 염분과 밤늦은 수분 폭식", tea: "둥글레차, 보리차" },
    es: { help: "Sésamo negro, alga, caldo suave", cut: "Sal de más y beber en exceso de madrugada", tea: "Polygonatum, cebada tostada" },
    pl: { help: "Czarny sezam, algi, łagodny bulion", cut: "Nadmiar soli i picie na późną noc", tea: "Kokoryczka, palony jęczmień" },
  },
};

const TRAVEL: Record<ElementKey, Record<Locale, { trips: [string, string][]; live: [string, string][] }>> = {
  wood: {
    ko: {
      trips: [
        ["교토", "나무와 정원, 동쪽 기운이 숨을 트이게 해요."],
        ["제주 서귀포", "초록과 바람이 목 기운을 살려 줘요."],
        ["밴쿠버", "숲과 바다가 시작의 리듬을 열어 줘요."],
      ],
      live: [
        ["서울 북촌·성북", "산책로와 나무가 일상에 목을 보태요."],
        ["베를린", "창작과 공원이 공존해 기획형 리듬이 살아요."],
      ],
    },
    es: {
      trips: [
        ["Kioto", "Árboles y jardín: el este abre el pecho."],
        ["Seogwipo, Jeju", "Verde y viento nutren la madera."],
        ["Vancouver", "Bosque y mar abren el ritmo de empezar."],
      ],
      live: [
        ["Bukchon / Seongbuk, Seúl", "Caminos y árboles suman madera al día."],
        ["Berlín", "Creación y parques: vive el ritmo de plan."],
      ],
    },
    pl: {
      trips: [
        ["Kioto", "Drzewa i ogród: wschód otwiera oddech."],
        ["Seogwipo na Jeju", "Zieleń i wiatr karmią drewno."],
        ["Vancouver", "Las i morze otwierają rytm startu."],
      ],
      live: [
        ["Bukchon / Seongbuk w Seulu", "Ścieżki i drzewa dokładają drewno do dnia."],
        ["Berlin", "Twórczość i parki: żyje rytm planu."],
      ],
    },
  },
  fire: {
    ko: {
      trips: [
        ["바르셀로나", "남쪽 빛과 거리의 온기가 화를 살려 줘요."],
        ["시칠리아", "태양과 식탁이 표현 리듬을 열어 줘요."],
        ["부산", "바다와 밤거리가 사람을 모아요."],
      ],
      live: [
        ["마드리드", "낮이 길고 사교가 일상이 돼요."],
        ["서울 이태원·한남", "사람과 음식이 불을 꺼뜨리지 않아요."],
      ],
    },
    es: {
      trips: [
        ["Barcelona", "Luz del sur y calor de calle nutren el fuego."],
        ["Sicilia", "Sol y mesa abren el ritmo de expresar."],
        ["Busán", "Mar y noche reúnen gente."],
      ],
      live: [
        ["Madrid", "Días largos y trato cotidiano."],
        ["Itaewon / Hannam, Seúl", "Gente y comida no apagan el fuego."],
      ],
    },
    pl: {
      trips: [
        ["Barcelona", "Południowe światło i ciepło ulicy karmią ogień."],
        ["Sycylia", "Słońce i stół otwierają rytm wyrazu."],
        ["Busan", "Morze i noc zbierają ludzi."],
      ],
      live: [
        ["Madryt", "Długi dzień i towarzyskość na co dzień."],
        ["Itaewon / Hannam w Seulu", "Ludzie i jedzenie nie gaszą ognia."],
      ],
    },
  },
  earth: {
    ko: {
      trips: [
        ["전주", "밥상과 한옥의 흙 기운이 중심을 잡아 줘요."],
        ["토스카나", "언덕과 식탁이 토를 안정시켜 줘요."],
        ["크라쿠프", "돌과 광장이 일상을 가라앉혀 줘요."],
      ],
      live: [
        ["수원·화성", "평지와 생활권이 토의 안정과 맞아요."],
        ["리옹", "식문화와 중간 규모의 도시가 과열을 줄여요."],
      ],
    },
    es: {
      trips: [
        ["Jeonju", "Mesa y hanok: la tierra sujeta el centro."],
        ["Toscana", "Colina y mesa asientan la tierra."],
        ["Cracovia", "Piedra y plaza calman el día."],
      ],
      live: [
        ["Suwon / Hwaseong", "Llano y vida cotidiana encajan con la tierra."],
        ["Lyon", "Cultura de mesa y ciudad mediana bajan el sobrecalor."],
      ],
    },
    pl: {
      trips: [
        ["Jeonju", "Stół i hanok: ziemia trzyma środek."],
        ["Toskania", "Wzgórze i stół uspokajają ziemię."],
        ["Kraków", "Kamień i rynek uspokajają dzień."],
      ],
      live: [
        ["Suwon / Hwaseong", "Równina i życie codzienne pasują do ziemi."],
        ["Lyon", "Kultura stołu i średnie miasto ścinają przegrzanie."],
      ],
    },
  },
  metal: {
    ko: {
      trips: [
        ["교토 서부·금각", "정리된 선과 흰빛이 금을 살려 줘요."],
        ["빈", "음악과 질서가 결단의 리듬과 맞아요."],
        ["헬싱키", "여백과 디자인이 금을 맑게 해요."],
      ],
      live: [
        ["서울 광화문·시청", "공공의 선과 기록이 금 기운과 맞아요."],
        ["취리히", "정확함과 깔끔한 도시 결이 오래 가요."],
      ],
    },
    es: {
      trips: [
        ["Oeste de Kioto / Kinkaku", "Línea limpia y blanco nutren el metal."],
        ["Viena", "Música y orden encajan con el ritmo de corte."],
        ["Helsinki", "Aire y diseño aclaran el metal."],
      ],
      live: [
        ["Gwanghwamun / Ayuntamiento, Seúl", "Línea pública y registro encajan con el metal."],
        ["Zúrich", "Precisión y ciudad nítida duran."],
      ],
    },
    pl: {
      trips: [
        ["Zachód Kioto / Kinkaku", "Czysta linia i biel karmią metal."],
        ["Wiedeń", "Muzyka i ład pasują do rytmu decyzji."],
        ["Helsinki", "Oddech i dizajn czyszczą metal."],
      ],
      live: [
        ["Gwanghwamun / ratusz w Seulu", "Publiczna linia i zapis pasują do metalu."],
        ["Zurych", "Precyzja i czyste miasto trzymają długo."],
      ],
    },
  },
  water: {
    ko: {
      trips: [
        ["리스본", "강과 언덕, 남색 타일이 수 기운을 열어 줘요."],
        ["그단스크", "항구와 벽돌이 물의 시야를 넓혀 줘요."],
        ["강릉", "동해와 커피 골목이 휴식을 줘요."],
      ],
      live: [
        ["인천 송도·월미", "물가와 곡선 동선이 수와 맞아요."],
        ["암스테르담", "운하와 자전거가 생각을 흐르게 해요."],
      ],
    },
    es: {
      trips: [
        ["Lisboa", "Río, colina y azulejo índigo abren el agua."],
        ["Gdańsk", "Puerto y ladrillo ensanchan la mirada del agua."],
        ["Gangneung", "Mar del Este y cafés dan descanso."],
      ],
      live: [
        ["Songdo / Wolmi, Incheon", "Orilla y curva encajan con el agua."],
        ["Ámsterdam", "Canal y bici dejan fluir el pensamiento."],
      ],
    },
    pl: {
      trips: [
        ["Lizbona", "Rzeka, wzgórze i granatowy kafelek otwierają wodę."],
        ["Gdańsk", "Port i cegła poszerzają pole wody."],
        ["Gangneung", "Morze Wschodnie i kawiarnie dają odpoczynek."],
      ],
      live: [
        ["Songdo / Wolmi w Incheonie", "Brzeg i łuk pasują do wody."],
        ["Amsterdam", "Kanał i rower puszczają myśl w ruch."],
      ],
    },
  },
};

const MUSIC: Record<ElementKey, Record<Locale, { genre: string; mood: string; when: string }>> = {
  wood: {
    ko: { genre: "어쿠스틱, 포크, 잔잔한 재즈", mood: "아침처럼 열리는 분위기", when: "공부·산책·기획할 때" },
    es: { genre: "Acústico, folk, jazz suave", mood: "Como una mañana que se abre", when: "Estudiar, pasear, planear" },
    pl: { genre: "Akustyk, folk, łagodny jazz", mood: "Jak otwierający się poranek", when: "Nauka, spacer, planowanie" },
  },
  fire: {
    ko: { genre: "소울, 라틴, 신나는 팝", mood: "자리를 밝히는 온기", when: "운동·모임·창작 워밍업" },
    es: { genre: "Soul, latino, pop alegre", mood: "Calor que ilumina el sitio", when: "Deporte, reunión, calentar la creación" },
    pl: { genre: "Soul, latino, radosny pop", mood: "Ciepło, które rozświetla miejsce", when: "Sport, spotkanie, rozgrzewka twórcza" },
  },
  earth: {
    ko: { genre: "발라드, 클래식 현악, 로파이", mood: "발이 땅에 붙는 안정", when: "식사·휴식·정리할 때" },
    es: { genre: "Balada, cuerda clásica, lo-fi", mood: "Estabilidad con los pies en el suelo", when: "Comer, descansar, ordenar" },
    pl: { genre: "Ballada, smyczki klasyczne, lo-fi", mood: "Stabilność z nogami na ziemi", when: "Jedzenie, odpoczynek, porządki" },
  },
  metal: {
    ko: { genre: "미니멀 피아노, 앰비언트, 바로크", mood: "선이 맑고 여백이 있는 소리", when: "집중 업무·마감·명상" },
    es: { genre: "Piano minimal, ambient, barroco", mood: "Línea nítida y aire", when: "Trabajo de foco, cierre, meditación" },
    pl: { genre: "Minimalne piano, ambient, barok", mood: "Czysta linia i oddech", when: "Praca w skupieniu, deadline, medytacja" },
  },
  water: {
    ko: { genre: "드림팝, 잔잔한 일렉, 비 소리", mood: "밤에 흐르는 물", when: "잠들기 전·혼자 있는 아침" },
    es: { genre: "Dreampop, electrónica suave, lluvia", mood: "Agua que corre de noche", when: "Antes de dormir, mañana a solas" },
    pl: { genre: "Dreampop, łagodna elektronika, deszcz", mood: "Woda płynąca nocą", when: "Przed snem, samotny poranek" },
  },
};

const HOBBY: Record<ElementKey, Record<Locale, { hobby: string; sport: string }>> = {
  wood: {
    ko: { hobby: "원예, 목공, 하이킹, 글쓰기", sport: "걷기, 요가, 배드민턴" },
    es: { hobby: "Jardín, madera, senderismo, escribir", sport: "Caminar, yoga, bádminton" },
    pl: { hobby: "Ogród, drewno, trekking, pisanie", sport: "Chód, joga, badminton" },
  },
  fire: {
    ko: { hobby: "요리 모임, 사진, 춤, 공연 관람", sport: "달리기, 댄스, 가벼운 근력" },
    es: { hobby: "Cocinar en grupo, foto, baile, teatro", sport: "Correr, danza, fuerza suave" },
    pl: { hobby: "Wspólne gotowanie, zdjęcia, taniec, teatr", sport: "Bieg, taniec, lekka siła" },
  },
  earth: {
    ko: { hobby: "베이킹, 도예, 보드게임, 정리", sport: "필라테스, 등산, 수영 평영" },
    es: { hobby: "Horno, cerámica, juegos de mesa, ordenar", sport: "Pilates, monte, braza" },
    pl: { hobby: "Pieczenie, ceramika, planszówki, porządki", sport: "Pilates, góry, żabka" },
  },
  metal: {
    ko: { hobby: "악기, 바느질, 바둑·체스, 기록", sport: "골프, 펜싱, 클라이밍" },
    es: { hobby: "Instrumento, costura, go/ajedrez, registro", sport: "Golf, esgrima, escalada" },
    pl: { hobby: "Instrument, szycie, go/szachy, notatki", sport: "Golf, szermierka, wspinaczka" },
  },
  water: {
    ko: { hobby: "독서, 사우나, 낚시, 영화", sport: "수영, 스트레칭, 자전거" },
    es: { hobby: "Lectura, sauna, pesca, cine", sport: "Natación, estirar, bici" },
    pl: { hobby: "Czytanie, sauna, wędka, kino", sport: "Pływanie, rozciąganie, rower" },
  },
};

const NUMBERS: Record<ElementKey, number[]> = {
  wood: [3, 8],
  fire: [2, 7],
  earth: [5, 10],
  metal: [4, 9],
  water: [1, 6],
};

const WEEKDAY: Record<ElementKey, Record<Locale, string>> = {
  wood: { ko: "목요일", es: "jueves", pl: "czwartek" },
  fire: { ko: "화요일", es: "martes", pl: "wtorek" },
  earth: { ko: "토요일", es: "sábado", pl: "sobota" },
  metal: { ko: "금요일", es: "viernes", pl: "piątek" },
  water: { ko: "수요일", es: "miércoles", pl: "środa" },
};

const SEASON: Record<ElementKey, Record<Locale, string>> = {
  wood: { ko: "봄", es: "primavera", pl: "wiosna" },
  fire: { ko: "여름", es: "verano", pl: "lato" },
  earth: { ko: "환절기(늦여름)", es: "el cambio de estación", pl: "przełom / późne lato" },
  metal: { ko: "가을", es: "otoño", pl: "jesień" },
  water: { ko: "겨울", es: "invierno", pl: "zima" },
};

export function fashionFor(ctx: ThemeCtx) {
  const key = ctx.yongsinKeys[0] ?? ctx.support;
  return FASHION[key][ctx.locale];
}

export function foodFor(ctx: ThemeCtx) {
  const key = ctx.yongsinKeys[0] ?? ctx.support;
  return FOOD[key][ctx.locale];
}

export function travelFor(ctx: ThemeCtx) {
  const key = ctx.yongsinKeys[0] ?? ctx.output;
  return TRAVEL[key][ctx.locale];
}

export function musicFor(ctx: ThemeCtx) {
  const key = ctx.yongsinKeys[0] ?? ctx.day.element;
  return MUSIC[key][ctx.locale];
}

export function hobbyFor(ctx: ThemeCtx) {
  const key = ctx.yongsinKeys[0] ?? ctx.day.element;
  return HOBBY[key][ctx.locale];
}

export function luckyBits(ctx: ThemeCtx) {
  const key = ctx.yongsinKeys[0] ?? ctx.support;
  const extra = ctx.heesinKeys[0] ?? ctx.output;
  const nums = [...new Set([...NUMBERS[key], NUMBERS[extra][0]])].slice(0, 3);
  return {
    numbers: nums,
    weekday: WEEKDAY[key][ctx.locale],
    season: SEASON[key][ctx.locale],
  };
}

export function directionOf(element: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "동", es: "este", pl: "wschód" },
    fire: { ko: "남", es: "sur", pl: "południe" },
    earth: { ko: "중앙·남서", es: "centro / suroeste", pl: "środek / południowy zachód" },
    metal: { ko: "서", es: "oeste", pl: "zachód" },
    water: { ko: "북", es: "norte", pl: "północ" },
  };
  return table[element][locale];
}

export function monthAdvice(elements: ElementKey[], locale: Locale, good: boolean): string {
  const months: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "3·4월", es: "marzo y abril", pl: "marzec i kwiecień" },
    fire: { ko: "5·6월", es: "mayo y junio", pl: "maj i czerwiec" },
    earth: { ko: "2·8·11월", es: "febrero, agosto y noviembre", pl: "luty, sierpień i listopad" },
    metal: { ko: "9·10월", es: "septiembre y octubre", pl: "wrzesień i październik" },
    water: { ko: "12·1월", es: "diciembre y enero", pl: "grudzień i styczeń" },
  };
  const picked = (elements[0] ? months[elements[0]][locale] : "") || loc(locale, "환절기", "el cambio de estación", "przełom");
  return good
    ? loc(locale, `좋은 달: ${picked}`, `Meses buenos: ${picked}`, `Dobre miesiące: ${picked}`)
    : loc(locale, `조심할 달: ${picked}`, `Meses de cuidado: ${picked}`, `Miesiące ostrożności: ${picked}`);
}
