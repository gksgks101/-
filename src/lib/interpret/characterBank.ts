import type { Locale } from "@/lib/i18n/config";
import { personCaution, personFit } from "./plainVoice";
import { loc, type GodGroup, type ThemeCtx } from "./themeContext";

const PROS: Record<string, Record<Locale, string[]>> = {
  甲: {
    ko: ["방향을 빨리 정해요", "한번 맡은 일은 잘 안 놓아요", "앞에서 책임을 져요"],
    es: ["Eliges rumbo pronto", "No sueltas fácil lo que asumes", "Asumes la responsabilidad delante"],
    pl: ["Szybko bierzesz kurs", "Nie puszczasz łatwo wziętej sprawy", "Bierzesz odpowiedzialność z przodu"],
  },
  乙: {
    ko: ["분위기와 사람 사이를 잘 읽어요", "휘어져도 안 꺾여요", "충돌보다 우회로를 찾아요"],
    es: ["Lees el ambiente y a la gente", "Te doblas sin romperte", "Eliges el desvío antes que el choque"],
    pl: ["Czytasz nastrój i ludzi", "Gniesz się, ale nie łamiesz", "Wybierasz objazd zamiast zderzenia"],
  },
  丙: {
    ko: ["자리를 밝히고 사람을 모아요", "열정이 전염돼요", "숨기는 타입이 아니에요"],
    es: ["Iluminas y reúnes gente", "Tu entusiasmo contagia", "No eres de esconderte"],
    pl: ["Rozświetlasz i zbierasz ludzi", "Entuzjazm zaraża", "Nie chowasz się"],
  },
  丁: {
    ko: ["한 사람과 한 일을 오래 데워요", "섬세한 미감이 있어요", "기억과 취향이 깊어요"],
    es: ["Calientas largo a una persona o una obra", "Tienes gusto fino", "Memoria y gusto hondos"],
    pl: ["Długo ogrzewasz jedną osobę albo sprawę", "Masz cienki smak", "Pamięć i gust są głębokie"],
  },
  戊: {
    ko: ["한번 맡은 자리를 버텨요", "신뢰를 쌓는 속도가 있어요", "주변의 버팀목이 돼요"],
    es: ["Si asumes un sitio, te quedas", "Sabes acumular confianza", "Te vuelves pilar de los demás"],
    pl: ["Wzięte miejsce wytrzymujesz", "Umiesz budować zaufanie", "Stajesz się podporą innych"],
  },
  己: {
    ko: ["빈 곳을 메워요", "사람을 챙기는 손이 있어요", "실무에서 빛이 나요"],
    es: ["Rellenas huecos", "Tienes mano para cuidar gente", "Brillas en lo práctico"],
    pl: ["Wypełniasz luki", "Masz rękę do ogarniania ludzi", "Świecisz w robocie"],
  },
  庚: {
    ko: ["결론을 빨리 잘라요", "원칙이 흔들리지 않아요", "품질을 지키는 눈이 있어요"],
    es: ["Cortas pronto a la conclusión", "El principio no tiembla", "Ojo para guardar la calidad"],
    pl: ["Szybko tniesz do konkluzji", "Zasada się nie chwieje", "Masz oko do jakości"],
  },
  辛: {
    ko: ["디테일을 놓치지 않아요", "품격과 취향이 분명해요", "완성도에 자존감이 있어요"],
    es: ["No se te escapa el detalle", "Tono y gusto claros", "La autoestima vive en el acabado"],
    pl: ["Nie umyka ci detal", "Ton i gust jasne", "Godność wisi na wykończeniu"],
  },
  壬: {
    ko: ["판을 크게 봐요", "정보와 유머가 많아요", "한곳에 안 묶여요"],
    es: ["Ves el tablero grande", "Hay información y humor", "No te atas a un sitio"],
    pl: ["Widzisz szeroką planszę", "Dużo informacji i humoru", "Nie wiążesz się z jednym miejscem"],
  },
  癸: {
    ko: ["말보다 먼저 마음을 읽어요", "직관이 빨라요", "회복과 돌봄에 맞아요"],
    es: ["Lees el ánimo antes que las palabras", "Intuición rápida", "Te sienta recobrar y cuidar"],
    pl: ["Czytasz serce wcześniej niż słowa", "Szybka intuicja", "Pasuje ci odzysk i troska"],
  },
};

const CONS: Record<string, Record<Locale, string[]>> = {
  甲: {
    ko: ["한번 꽂으면 잘 안 바꿔요", "타인의 속도에 맞추기 어려워요", "혼자 숲을 만들려다 지쳐요"],
    es: ["Si te fijas, no cambias fácil", "Te cuesta adaptar el ritmo a otros", "Te cansas si haces todo el bosque solo"],
    pl: ["Jak się wbijesz, nie zmieniasz łatwo", "Trudno dopasować tempo do innych", "Męczysz się, budując las sam"],
  },
  乙: {
    ko: ["거절을 직접 말하기 어려워요", "결정을 미루면 본심이 흐려져요", "거리를 조절하다 오해가 나요"],
    es: ["Te cuesta un no directo", "Si aplazas, se nubla el deseo real", "Al regular la distancia nace malentendido"],
    pl: ["Trudno powiedzieć ostre „nie”", "Jak odwlekasz, mętnieje pragnienie", "Regulując dystans, rodzi się nieporozumienie"],
  },
  丙: {
    ko: ["그늘이 필요한 사람을 답답해해요", "느린 절차에 금방 지쳐요", "불을 오래 켜 두면 스스로 타요"],
    es: ["Te ahoga quien necesita sombra", "Los trámites lentos te agotan", "Si dejas la luz encendida, te quemas"],
    pl: ["Duszą cię ci, co potrzebują cienia", "Wolne procedury szybko męczą", "Jak za długo świecisz, palisz siebie"],
  },
  丁: {
    ko: ["무시당하면 입을 닫아요", "열정을 혼자 품으면 과열돼요", "큰 무대보다 밀도에 집착해요"],
    es: ["Si te ignoran, callas", "Si guardas sola la pasión, te sobrecalientas", "Te aferras a la densidad más que al gran escenario"],
    pl: ["Jak cię zignorują, milkniesz", "Pasja w pojedynkę się przegrzewa", "Lgniesz do gęstości bardziej niż do wielkiej sceny"],
  },
  戊: {
    ko: ["쉽게 안 움직여요", "말 바꾸기를 스트레스로 느껴요", "안 내려놓아서 스스로 무거워져요"],
    es: ["No te mueves a la ligera", "Cambiar de palabra te estresa", "Si no sueltas, te vuelves pesado"],
    pl: ["Nie ruszasz się lekko", "Zmiana zdania daje stres", "Jak nie odkładasz, sam się obciążasz"],
  },
  己: {
    ko: ["너무 많이 품으면 밭이 굳어요", "거절이 늦어요", "칭찬보다 부탁에만 힘이 나요"],
    es: ["Si acoge demasiado, el campo se endurece", "El no llega tarde", "Te da más fuerza un encargo que un elogio"],
    pl: ["Jak za dużo weźmiesz, pole twardnieje", "Odmowa spóźnia się", "Bardziej niż pochwała działa prośba"],
  },
  庚: {
    ko: ["원칙이 흔들리면 화가 나요", "자를 줄만 알고 붙일 줄을 모를 때가 있어요", "말이 짧아 차갑게 들려요"],
    es: ["Si tiembla el principio, sale ira", "A veces solo cortas y no unes", "El habla corta suena fría"],
    pl: ["Gdy chwieje się zasada, pojawia się gniew", "Bywa, że tylko tniesz i nie spajasz", "Krótka mowa brzmi chłodno"],
  },
  辛: {
    ko: ["대충인 환경에서 기운이 빠져요", "상처를 비밀로만 깎으면 고립돼요", "예민함이 예민함으로만 보여요"],
    es: ["En un entorno chapucero te apagas", "Si talla las heridas en secreto, te aíslas", "La sensibilidad se ve solo como susceptibilidad"],
    pl: ["W bylejakości gaśniesz", "Rany szlifowane w tajemnicy dają izolację", "Wrażliwość widać tylko jako przewrażliwienie"],
  },
  壬: {
    ko: ["한곳에 묶이면 답답해요", "표면만 흘러가 깊이가 안 보일 때가 있어요", "마감이 없으면 재능이 착지 못해요"],
    es: ["Lo atado te ahoga", "A veces fluyes solo por la superficie", "Sin plazo el talento no aterriza"],
    pl: ["Ciasnota dusi", "Bywa, że płyniesz tylko po powierzchni", "Bez deadline talent nie ląduje"],
  },
  癸: {
    ko: ["시끄러운 경쟁에서 자신을 숨겨요", "경계가 흐려지기 쉬워요", "티가 안 나서 오해받아요"],
    es: ["En competición ruidosa te ocultas", "El borde se nubla fácil", "Como no se te ve, te malinterpretan"],
    pl: ["W głośnej rywalizacji się chowasz", "Granica łatwo się zaciera", "Bo cię nie widać, źle cię odczytują"],
  },
};

const PUBLIC_REAL: Record<string, Record<Locale, { public: string; real: string }>> = {
  甲: {
    ko: { public: "남들은 당신을 리더처럼 봐요.", real: "속은 ‘이 방향이 맞나’를 혼자 점검하는 사람이에요." },
    es: { public: "Te ven como líder.", real: "Por dentro revisas a solas si el rumbo es el bueno." },
    pl: { public: "Widzą w tobie lidera.", real: "W środku sam sprawdzasz, czy kurs jest dobry." },
  },
  乙: {
    ko: { public: "남들은 당신을 부드러운 사람으로 봐요.", real: "속은 질기고, 거리를 재며 버티는 사람이에요." },
    es: { public: "Te ven suave.", real: "Por dentro eres tenaz y regulas la distancia." },
    pl: { public: "Widzą w tobie miękkość.", real: "W środku jesteś wytrwały i mierzysz dystans." },
  },
  丙: {
    ko: { public: "남들은 당신을 밝은 사람으로 봐요.", real: "속은 그늘이 필요해도 불을 끄기 미안해하는 사람이에요." },
    es: { public: "Te ven luminoso.", real: "Por dentro necesitas sombra, pero te da pena apagar." },
    pl: { public: "Widzą w tobie jasność.", real: "W środku potrzebujesz cienia, ale wstyd gasić." },
  },
  丁: {
    ko: { public: "남들은 당신을 다정한 사람으로 봐요.", real: "속은 한 사람·한 작품에만 불이 켜지는 사람이에요." },
    es: { public: "Te ven tierno.", real: "Por dentro la llama se enciende por una persona o una obra." },
    pl: { public: "Widzą w tobie czułość.", real: "W środku ogień zapala się przy jednej osobie albo jednym dziele." },
  },
  戊: {
    ko: { public: "남들은 당신을 든든한 사람으로 봐요.", real: "속은 체면과 신뢰를 지키느라 무거운 사람이에요." },
    es: { public: "Te ven sólido.", real: "Por dentro pesas por guardar honor y confianza." },
    pl: { public: "Widzą w tobie oparcie.", real: "W środku ciąży ci pilnowanie twarzy i zaufania." },
  },
  己: {
    ko: { public: "남들은 당신을 챙기는 사람으로 봐요.", real: "속은 ‘나도 비었는데’를 잘 말 못 하는 사람이에요." },
    es: { public: "Te ven como quien cuida.", real: "Por dentro te cuesta decir “yo también estoy vacío”." },
    pl: { public: "Widzą w tobie kogoś, kto ogarnia.", real: "W środku trudno ci powiedzieć „ja też jestem pusty”." },
  },
  庚: {
    ko: { public: "남들은 당신을 단호한 사람으로 봐요.", real: "속은 인정 한 줄을 기다리는 사람이에요." },
    es: { public: "Te ven tajante.", real: "Por dentro esperas una línea de reconocimiento." },
    pl: { public: "Widzą w tobie stanowczość.", real: "W środku czekasz na jedną linijkę uznania." },
  },
  辛: {
    ko: { public: "남들은 당신을 세련된 사람으로 봐요.", real: "속은 품질이 떨어지면 자존감이 같이 떨어지는 사람이에요." },
    es: { public: "Te ven con tono.", real: "Por dentro, si baja la calidad, baja contigo la autoestima." },
    pl: { public: "Widzą w tobie klasę.", real: "W środku, gdy spada jakość, spada z nią godność." },
  },
  壬: {
    ko: { public: "남들은 당신을 여유 있는 사람으로 봐요.", real: "속은 형태가 없으면 불안한 바다예요." },
    es: { public: "Te ven holgado.", real: "Por dentro el mar se inquieta si no hay costa." },
    pl: { public: "Widzą w tobie luz.", real: "W środku morze się niepokoi, gdy nie ma brzegu." },
  },
  癸: {
    ko: { public: "남들은 당신을 조용한 사람으로 봐요.", real: "속은 이미 다 읽고 있는 사람이에요." },
    es: { public: "Te ven callado.", real: "Por dentro ya lo has leído todo." },
    pl: { public: "Widzą w tobie milczenie.", real: "W środku już wszystko odczytałeś." },
  },
};

const STRESS: Record<GodGroup, Record<Locale, { act: string; ease: string }>> = {
  비겁: {
    ko: { act: "스트레스 받으면 혼자 결정하거나 경쟁으로 들어요.", ease: "푸는 법: ‘내 몫/네 몫’을 한 줄로 나누고 몸을 움직이세요." },
    es: { act: "Bajo estrés decides solo o lo oyes como competición.", ease: "Alivio: parte “lo mío / lo tuyo” y mueve el cuerpo." },
    pl: { act: "Przy stresie decydujesz sam albo słyszysz wyścig.", ease: "Ulga: podziel „moje / twoje” i rusz ciało." },
  },
  식상: {
    ko: { act: "스트레스 받으면 말이 많아지거나 만들어 보여 주려 해요.", ease: "푸는 법: 70점에 내보내고, 남은 말은 메모로 옮기세요." },
    es: { act: "Bajo estrés hablas más o quieres mostrar algo hecho.", ease: "Alivio: suelta al 70% y pasa el resto al papel." },
    pl: { act: "Przy stresie mówisz więcej albo chcesz coś pokazać.", ease: "Ulga: wypuść przy 70% i resztę przenieś na kartkę." },
  },
  재성: {
    ko: { act: "스트레스 받으면 숫자와 생활비부터 만져요.", ease: "푸는 법: 감정과 계산을 15분씩 나눠 적으세요." },
    es: { act: "Bajo estrés tocas primero cifras y gastos.", ease: "Alivio: 15 minutos de emoción y 15 de cálculo, por escrito." },
    pl: { act: "Przy stresie najpierw ruszasz cyfry i rachunki.", ease: "Ulga: 15 minut emocji i 15 minut rachunku na piśmie." },
  },
  관성: {
    ko: { act: "스트레스 받으면 역할이 모호한 자리를 화로 느껴요.", ease: "푸는 법: ‘내가 책임지는 한 줄’을 문서처럼 받으세요." },
    es: { act: "Bajo estrés el rol vago se siente como ira.", ease: "Alivio: pide por escrito la línea de lo que es tuyo." },
    pl: { act: "Przy stresie mglista rola jest jak złość.", ease: "Ulga: weź na piśmie linijkę tego, co jest twoje." },
  },
  인성: {
    ko: { act: "스트레스 받으면 더 배우고 준비하다 실행이 늦어요.", ease: "푸는 법: 공부 끝을 ‘공개한 결과물 하나’로 정하세요." },
    es: { act: "Bajo estrés estudias más y se atrasa el hacer.", ease: "Alivio: el fin del estudio es un resultado publicado." },
    pl: { act: "Przy stresie uczysz się więcej i spóźnia się wykonanie.", ease: "Ulga: koniec nauki to jeden opublikowany wynik." },
  },
};

export function characterBits(ctx: ThemeCtx) {
  const gan = ctx.day.gan;
  const locale = ctx.locale;
  const pub = PUBLIC_REAL[gan]?.[locale] ?? PUBLIC_REAL["甲"][locale];
  const stress = STRESS[ctx.dominantGroup][locale];
  return {
    pros: PROS[gan]?.[locale] ?? PROS["甲"][locale],
    cons: CONS[gan]?.[locale] ?? CONS["甲"][locale],
    public: pub.public,
    real: pub.real,
    stressAct: stress.act,
    stressEase: stress.ease,
  };
}

export function loveTypes(ctx: ThemeCtx): { fit: string[]; caution: string[] } {
  const { locale, support, output, pressure, day } = ctx;
  const a = personFit(support, locale, "love");
  const b = personFit(output, locale, "love");
  const c = personFit(day.element, locale, "love");
  const d = personCaution(pressure, locale, "love");
  return {
    fit: [a, b, c].map((item) => `${item.label} — ${item.why}`),
    caution: [
      `${d.label} — ${d.why}`,
      loc(locale, "약속을 흐리고 밀당만 하는 사람 — 마음이 먼저 지쳐요.", "Quien nubla la cita y solo tira y afloja: el ánimo se cansa primero.", "Kto mąci umowę i tylko gra na zwłokę — serce męczy się pierwsze."),
    ],
  };
}
