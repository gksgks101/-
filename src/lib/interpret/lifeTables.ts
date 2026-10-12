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

const JOB_LINES: Record<string, Record<Locale, { saju: string; easy: string }[]>> = {
  조직형: {
    ko: [
      { saju: "관성이 사람과 규칙을 한 판에서 다루게 함", easy: "인사처럼 역할을 나누는 자리에서 오래 가요." },
      { saju: "월지 십성이 조직에서 보이는 태도", easy: "프로젝트처럼 마감과 사람을 묶는 일이 맞아요." },
      { saju: "비겁이 손님·동료와 나란히 섬", easy: "호텔처럼 서비스 규칙이 보이면 힘이 나요." },
      { saju: "정관 계열이 기록과 절차를 받침", easy: "행정처럼 문서가 남는 일이 체질이에요." },
      { saju: "빈 곳을 메우는 조율 감각", easy: "코디네이터처럼 혼자 다 쥐지 않는 팀이 맞아요." },
    ],
    es: [
      { saju: "La autoridad junta gente y normas", easy: "Como personal: dura si se parten roles." },
      { saju: "La rama del mes es la actitud en la organización", easy: "Como jefe de proyecto: plazo y gente a la vez." },
      { saju: "Los compañeros se ponen al lado del huésped", easy: "Como hotelero: si se ve la norma de servicio, hay fuerza." },
      { saju: "El cargo estable sostiene registro y trámite", easy: "Como administrativo: el papel que queda es tu cuerpo." },
      { saju: "Olfato para rellenar huecos", easy: "Como coordinador: un equipo que no lo agarra todo." },
    ],
    pl: [
      { saju: "Autorytet łączy ludzi i zasady", easy: "Jak kadry: wytrzymasz, gdy role są podzielone." },
      { saju: "Gałąź miesiąca to postawa w organizacji", easy: "Jak kierownik projektu: deadline i ludzie naraz." },
      { saju: "Towarzysze stają obok gościa", easy: "Jak hotelarz: gdy widać regułę obsługi, jest siła." },
      { saju: "Urząd podpiera zapis i procedurę", easy: "Jak administracja: papier, który zostaje, to twoja budowa." },
      { saju: "Węch do wypełniania luk", easy: "Jak koordynator: zespół, który nie chwyta wszystkiego." },
    ],
  },
  공무원형: {
    ko: [
      { saju: "정관이 공적 책임과 규율을 받침", easy: "경찰처럼 규칙이 분명한 현장이 맞아요." },
      { saju: "편관이 위급을 연료로 씀", easy: "소방처럼 압박이 있는 자리에서 집중이 나와요." },
      { saju: "인성이 숫자·조문을 자산으로 만듦", easy: "세무처럼 시험과 조문이 단가가 돼요." },
      { saju: "정인이 가르치고 보호하는 자리", easy: "교사처럼 역할이 보이면 오래 가요." },
      { saju: "정관+인성이 공공 돌봄을 받침", easy: "사회복지처럼 절차 있는 돌봄이 체질이에요." },
    ],
    es: [
      { saju: "El cargo sostiene deber público y norma", easy: "Como policía: un campo con regla clara." },
      { saju: "La presión usa la urgencia de combustible", easy: "Como bombero: la concentración sale bajo apuro." },
      { saju: "La impronta vuelve cifra y artículo en activo", easy: "Como inspector fiscal: examen y norma marcan tarifa." },
      { saju: "El apoyo es enseñar y amparar", easy: "Como docente: si el rol se ve, duras." },
      { saju: "Cargo e impronta sostienen el cuidado público", easy: "Como trabajador social: el cuidado con trámite es tu cuerpo." },
    ],
    pl: [
      { saju: "Urząd podpiera obowiązek publiczny i normę", easy: "Jak policjant: pole z jasną zasadą." },
      { saju: "Presja bierze nagłość za paliwo", easy: "Jak strażak: skupienie wychodzi w napięciu." },
      { saju: "Pieczęć zamienia cyfrę i przepis w aktyw", easy: "Jak skarbówka: egzamin i przepis to stawka." },
      { saju: "Wsparcie to uczyć i osłaniać", easy: "Jak nauczyciel: gdy widać rolę, wytrzymasz." },
      { saju: "Urząd i pieczęć podpierają publiczną troskę", easy: "Jak pracownik socjalny: troska z procedurą to twoja budowa." },
    ],
  },
  전문직형: {
    ko: [
      { saju: "정관+인성이 조문과 변론을 단가로 만듦", easy: "변호사처럼 자격과 말이 수입이 돼요." },
      { saju: "정재가 숫자 약속을 지킴", easy: "회계사처럼 장부가 남는 일이 맞아요." },
      { saju: "인성이 조제·돌봄 지식을 받침", easy: "약사처럼 깊이 있는 한 분야가 단가예요." },
      { saju: "정관이 노동 규범을 읽음", easy: "노무사처럼 조문과 사람이 겹치는 자리예요." },
      { saju: "식상이 기술을 문서로 남김", easy: "변리사처럼 아이디어를 권리로 바꾸는 일이 맞아요." },
    ],
    es: [
      { saju: "Cargo e impronta: artículo y alegato marcan tarifa", easy: "Como abogado: título y palabra son ingreso." },
      { saju: "La riqueza estable guarda la cifra prometida", easy: "Como contador: el libro que queda te sienta." },
      { saju: "La impronta sostiene saber de cuidado", easy: "Como farmacéutico: un oficio hondo es la tarifa." },
      { saju: "El cargo lee la norma laboral", easy: "Como asesor laboral: artículo y gente se cruzan." },
      { saju: "La expresión deja la técnica por escrito", easy: "Como patentes: convertir idea en derecho." },
    ],
    pl: [
      { saju: "Urząd i pieczęć: przepis i mowa to stawka", easy: "Jak adwokat: kwalifikacja i słowo to przychód." },
      { saju: "Stały majątek trzyma obiecaną cyfrę", easy: "Jak księgowy: księga, która zostaje, ci leży." },
      { saju: "Pieczęć podpiera wiedzę troski", easy: "Jak farmaceuta: głęboki fach to stawka." },
      { saju: "Urząd czyta normę pracy", easy: "Jak kadry: przepis i człowiek się krzyżują." },
      { saju: "Wyraz zostawia technikę na piśmie", easy: "Jak patenty: zamienić pomysł w prawo." },
    ],
  },
  기술직형: {
    ko: [
      { saju: "식상이 손과 시스템으로 결과를 남김", easy: "개발처럼 코드가 남는 일이 맞아요." },
      { saju: "금·수가 기계의 규칙을 읽음", easy: "기계기술처럼 도면이 말이 되는 자리예요." },
      { saju: "식신이 회로를 안전하게 이음", easy: "전기기사처럼 반복 가능한 기술이 단가예요." },
      { saju: "토·금이 구조의 중심을 잡음", easy: "건축처럼 선이 남는 일이 체질이에요." },
      { saju: "식상+수가 데이터를 흐름으로 만듦", easy: "데이터 엔지니어처럼 파이프라인이 작품이 돼요." },
    ],
    es: [
      { saju: "La expresión deja resultado en mano y sistema", easy: "Como desarrollador: el código que queda te sienta." },
      { saju: "Metal y agua leen la norma de la máquina", easy: "Como técnico: el plano se vuelve palabra." },
      { saju: "La expresión une el circuito con calma", easy: "Como electricista: la técnica repetible es tarifa." },
      { saju: "Tierra y metal sujetan el centro de la estructura", easy: "Como arquitecto técnico: la línea que queda es tu cuerpo." },
      { saju: "Expresión y agua vuelven datos en flujo", easy: "Como ingeniero de datos: el tubo se vuelve obra." },
    ],
    pl: [
      { saju: "Wyraz zostawia wynik w ręku i systemie", easy: "Jak programista: kod, który zostaje, ci leży." },
      { saju: "Metal i woda czytają normę maszyny", easy: "Jak technik: rysunek staje się mową." },
      { saju: "Wyraz spaja obwód spokojnie", easy: "Jak elektryk: powtarzalna technika to stawka." },
      { saju: "Ziemia i metal trzymają środek konstrukcji", easy: "Jak technik architekt: linia, która zostaje, to twoja budowa." },
      { saju: "Wyraz i woda robią z danych przepływ", easy: "Jak inżynier danych: rura staje się dziełem." },
    ],
  },
  창업형: {
    ko: [
      { saju: "식상생재가 내 이름 현금 흐름을 만듦", easy: "자영업처럼 만들어 보여주는 쪽이 연료예요." },
      { saju: "편재가 기회 판을 키움", easy: "스타트업처럼 한 판을 직접 여는 일이 맞아요." },
      { saju: "식신이 손으로 남는 물건을 만듦", easy: "공방처럼 작품이 가게가 되는 리듬이에요." },
      { saju: "상관이 독립 의견으로 값을 받음", easy: "컨설턴트처럼 내 판단이 상품이 돼요." },
      { saju: "정재가 반복 매장을 지키게 함", easy: "점주처럼 약속된 매출이 마음을 놓게 해요." },
    ],
    es: [
      { saju: "Expresión→riqueza: flujo con tu nombre", easy: "Como autónomo: crear y mostrar es el combustible." },
      { saju: "La riqueza móvil agranda el tablero", easy: "Como fundador: abrir tú el tablero." },
      { saju: "La expresión hace objeto que queda en la mano", easy: "Como taller: la obra se vuelve tienda." },
      { saju: "El talento cobra por opinión independiente", easy: "Como consultor: tu juicio es el producto." },
      { saju: "La riqueza estable guarda el local que se repite", easy: "Como franquicia: el ingreso prometido calma." },
    ],
    pl: [
      { saju: "Wyraz→majątek: przepływ z nazwiskiem", easy: "Jak samozatrudnienie: tworzyć i pokazywać to paliwo." },
      { saju: "Ruchomy majątek powiększa planszę", easy: "Jak startup: sam otworzyć planszę." },
      { saju: "Wyraz robi przedmiot, który zostaje w ręku", easy: "Jak pracownia: dzieło staje się sklepem." },
      { saju: "Talent bierze zapłatę za niezależną opinię", easy: "Jak konsultant: twój osąd jest towarem." },
      { saju: "Stały majątek pilnuje powtarzalnego lokalu", easy: "Jak franczyza: obiecany utarg uspokaja." },
    ],
  },
  기획형: {
    ko: [
      { saju: "식상이 서비스를 설계함", easy: "서비스 기획처럼 판을 짜는 자리가 맞아요." },
      { saju: "상관이 이미지를 말로 만듦", easy: "브랜드처럼 한 줄 톤이 상품이 돼요." },
      { saju: "인성+식상이 사람 동선을 읽음", easy: "UX처럼 흐름을 그리는 일이 체질이에요." },
      { saju: "정관이 공공 규칙을 설계함", easy: "정책 기획처럼 조문과 현장이 겹쳐요." },
      { saju: "식신이 이야기를 채널로 짬", easy: "콘텐츠 기획처럼 만드는 판이 먼저예요." },
    ],
    es: [
      { saju: "La expresión diseña el servicio", easy: "Como planificador de servicio: armar el tablero." },
      { saju: "El talento hace imagen con palabras", easy: "Como marca: una línea de tono es el producto." },
      { saju: "Impronta y expresión leen el recorrido", easy: "Como UX: dibujar el flujo es tu cuerpo." },
      { saju: "El cargo diseña la norma pública", easy: "Como políticas: artículo y campo se cruzan." },
      { saju: "La expresión arma el relato en canal", easy: "Como contenidos: primero el tablero de crear." },
    ],
    pl: [
      { saju: "Wyraz projektuje usługę", easy: "Jak planista usług: stawiać planszę." },
      { saju: "Talent robi obraz słowem", easy: "Jak marka: jedna linijka tonu jest towarem." },
      { saju: "Pieczęć i wyraz czytają tor człowieka", easy: "Jak UX: rysować przepływ to twoja budowa." },
      { saju: "Urząd projektuje publiczną normę", easy: "Jak polityki: przepis i pole się krzyżują." },
      { saju: "Wyraz splata opowieść w kanał", easy: "Jak treści: najpierw plansza tworzenia." },
    ],
  },
  영업형: {
    ko: [
      { saju: "편재가 사람과 숫자 사이를 건너감", easy: "제약 영업처럼 거절을 일로 듣는 자리가 맞아요." },
      { saju: "상관이 현장을 말로 닫음", easy: "부동산처럼 한 건이 생활이 되는 리듬이에요." },
      { saju: "식상이 거리와 언어를 넓힘", easy: "해외영업처럼 판이 큰 자리가 숨이 트여요." },
      { saju: "정재가 약속을 반복 수입으로 만듦", easy: "보험처럼 지키는 계약이 마음이 놓여요." },
      { saju: "식신이 관계를 오래 데움", easy: "고객성공처럼 한 고객을 오래 보는 일이 맞아요." },
    ],
    es: [
      { saju: "La riqueza móvil cruza gente y cifra", easy: "Como visitador: oír el no como oficio." },
      { saju: "El talento cierra el campo con palabras", easy: "Como inmobiliaria: un trato se vuelve vida." },
      { saju: "La expresión ensancha distancia e idioma", easy: "Como exportación: el tablero grande abre el pecho." },
      { saju: "La riqueza estable vuelve el pacto en ingreso", easy: "Como seguros: el contrato que se cumple calma." },
      { saju: "La expresión calienta el vínculo largo", easy: "Como customer success: un cliente visto largo." },
    ],
    pl: [
      { saju: "Ruchomy majątek przechodzi między ludźmi i cyfrą", easy: "Jak pharma: słyszeć „nie” jako fach." },
      { saju: "Talent zamyka pole słowem", easy: "Jak nieruchomości: jeden deal staje się życiem." },
      { saju: "Wyraz poszerza dystans i język", easy: "Jak eksport: wielka plansza otwiera oddech." },
      { saju: "Stały majątek robi z umowy przychód", easy: "Jak ubezpieczenia: dotrzymana umowa uspokaja." },
      { saju: "Wyraz długo ogrzewa więź", easy: "Jak opieka klienta: jeden klient oglądany długo." },
    ],
  },
  연구형: {
    ko: [
      { saju: "인성이 깊게 파는 시간을 자산으로 만듦", easy: "연구원처럼 혼자 읽는 오전이 근무예요." },
      { saju: "식상이 숫자를 이야기로 바꿈", easy: "데이터 분석처럼 표가 말이 되는 일이 맞아요." },
      { saju: "정인이 전수와 강의를 받침", easy: "교수처럼 깊이 후 공개가 단가예요." },
      { saju: "정관+인성이 임상 절차를 지킴", easy: "임상연구처럼 기록이 남는 현장이 체질이에요." },
      { saju: "편재가 시장 흐름을 읽음", easy: "시장조사처럼 숫자 뒤의 사람이 보여요." },
    ],
    es: [
      { saju: "La impronta vuelve hondura en activo", easy: "Como investigador: la mañana de lectura es el trabajo." },
      { saju: "La expresión vuelve cifra en relato", easy: "Como analista: la tabla se vuelve palabra." },
      { saju: "El apoyo sostiene transmitir y dar clase", easy: "Como profesor: la hondura publicada es tarifa." },
      { saju: "Cargo e impronta guardan el trámite clínico", easy: "Como ensayo: el campo con registro es tu cuerpo." },
      { saju: "La riqueza móvil lee el flujo del mercado", easy: "Como mercado: se ve la gente detrás del número." },
    ],
    pl: [
      { saju: "Pieczęć zamienia głębię w aktyw", easy: "Jak badacz: poranek czytania jest etatem." },
      { saju: "Wyraz zamienia cyfrę w opowieść", easy: "Jak analityk: tabela staje się mową." },
      { saju: "Wsparcie podpiera przekaz i wykład", easy: "Jak wykładowca: opublikowana głębia to stawka." },
      { saju: "Urząd i pieczęć pilnują procedury klinicznej", easy: "Jak badania kliniczne: pole z zapisem to twoja budowa." },
      { saju: "Ruchomy majątek czyta przepływ rynku", easy: "Jak rynek: widać ludzi za liczbą." },
    ],
  },
  콘텐츠형: {
    ko: [
      { saju: "식상·화가 눈에 남는 형태를 원함", easy: "디자이너처럼 보이는 작품이 직업이 돼요." },
      { saju: "상관이 시간과 장면을 자름", easy: "영상 편집처럼 리듬을 자르는 일이 맞아요." },
      { saju: "인성+식상이 글을 남김", easy: "작가처럼 문장이 자산이 되는 리듬이에요." },
      { saju: "상관이 한 줄로 설득함", easy: "카피라이터처럼 짧은 말이 값이 돼요." },
      { saju: "화가 소리와 무대를 밝힘", easy: "뮤지션처럼 켜진 상태가 일이 되는 자리예요." },
    ],
    es: [
      { saju: "Expresión y fuego quieren forma que se ve", easy: "Como diseñador: la obra visible es el oficio." },
      { saju: "El talento corta tiempo y escena", easy: "Como editor de vídeo: cortar el ritmo." },
      { saju: "Impronta y expresión dejan letra", easy: "Como escritor: la frase se vuelve activo." },
      { saju: "El talento persuade en una línea", easy: "Como copy: la palabra corta vale." },
      { saju: "El fuego ilumina sonido y escenario", easy: "Como músico: el estado encendido es el trabajo." },
    ],
    pl: [
      { saju: "Wyraz i ogień chcą kształtu, który widać", easy: "Jak projektant: widoczne dzieło jest fachem." },
      { saju: "Talent tnie czas i scenę", easy: "Jak montaż: ciąć rytm." },
      { saju: "Pieczęć i wyraz zostawiają pismo", easy: "Jak pisarz: zdanie staje się aktywem." },
      { saju: "Talent przekonuje jedną linijką", easy: "Jak copy: krótkie słowo ma cenę." },
      { saju: "Ogień rozświetla dźwięk i scenę", easy: "Jak muzyk: stan włączony jest pracą." },
    ],
  },
  투자형: {
    ko: [
      { saju: "편재가 기회와 리스크를 숫자로 읽음", easy: "금융분석처럼 한도가 있는 판단이 맞아요." },
      { saju: "정재가 현금흐름을 지킴", easy: "재무분석처럼 새는 구멍을 먼저 봐요." },
      { saju: "편관이 손실 한도를 자름", easy: "리스크 관리처럼 자르는 일이 자산이에요." },
      { saju: "토·금이 실물 가치를 가늠함", easy: "감정평가처럼 눈에 보이는 값이 마음이 놓여요." },
      { saju: "식상이 운용 규칙을 문서로 남김", easy: "펀드 보조처럼 정산 주기가 기본 장비예요." },
    ],
    es: [
      { saju: "La riqueza móvil lee oportunidad y riesgo en cifra", easy: "Como analista financiero: un juicio con techo." },
      { saju: "La riqueza estable guarda el flujo", easy: "Como finanzas: primero las fugas." },
      { saju: "La presión corta el techo de pérdida", easy: "Como riesgos: cortar es el activo." },
      { saju: "Tierra y metal tasan el valor real", easy: "Como tasador: el valor que se ve calma." },
      { saju: "La expresión deja la norma de gestión por escrito", easy: "Como fondos: el ciclo de liquidación es el equipo de serie." },
    ],
    pl: [
      { saju: "Ruchomy majątek czyta okazję i ryzyko w cyfrze", easy: "Jak analityk finansowy: osąd z limitem." },
      { saju: "Stały majątek pilnuje przepływu", easy: "Jak finanse: najpierw wycieki." },
      { saju: "Presja tnie limit straty", easy: "Jak ryzyko: cięcie jest aktywem." },
      { saju: "Ziemia i metal szacują realną wartość", easy: "Jak rzeczoznawca: widoczna wartość uspokaja." },
      { saju: "Wyraz zostawia normę zarządzania na piśmie", easy: "Jak fundusz: cykl rozliczenia to fabryczne wyposażenie." },
    ],
  },
};

export function rankedJobs(types: TypeScore[], locale: Locale): RankedJob[] {
  const ranked: RankedJob[] = [];
  const used = new Set<string>();
  for (const item of types) {
    const names = JOBS[item.type]?.[locale] ?? [];
    const lines = JOB_LINES[item.type]?.[locale] ?? [];
    for (const [index, name] of names.entries()) {
      if (used.has(name)) continue;
      used.add(name);
      const why = lines[index];
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
