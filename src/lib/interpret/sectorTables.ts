import type { Locale } from "@/lib/i18n/config";
import { GOD_GROUP_NAME, TWELVE_STAGE_NAME, tenGod, term } from "@/lib/i18n/terms";
import { prose } from "@/lib/i18n/prose";
import type { ElementKey } from "@/lib/saju/types";
import { loc, type GodGroup, type InvestStyle, type ThemeCtx } from "./themeContext";

function trio(locale: Locale, table: Record<string, Record<Locale, string>>, key: string, fallback: Record<Locale, string>): string {
  return table[key]?.[locale] ?? fallback[locale];
}

const STAGE_FRONT: Record<string, Record<Locale, string>> = {
  장생: {
    ko: "장생은 시작·성장의 자리입니다. 호기심이 먼저 열리고, 완성보다 씨 뿌리는 리듬이 강합니다.",
    es: "Changsheng es inicio y crecimiento: primero la curiosidad, más sembrar que acabar.",
    pl: "Jangsaeng to start i wzrost: najpierw ciekawość, sianie raczej niż domykanie.",
  },
  목욕: {
    ko: "목욕은 감성과 관계의 물입니다. 매력이 드러나고, 동시에 기분·시선에 흔들리기 쉽습니다.",
    es: "Muyu es agua de emoción y vínculo: sale encanto y también oscila el ánimo.",
    pl: "Mogyok to woda emocji i więzi: widać urok, ale nastrój łatwo się chwieje.",
  },
  관대: {
    ko: "관대는 겉모습과 예법의 자리입니다. 첫인상·매너·포장이 일의 성패를 가릅니다.",
    es: "Guandai es imagen y protocolo: la primera impresión decide más de lo que parece.",
    pl: "Gwandae to wizerunek i protokół: pierwsze wrażenie rozstrzyga więcej, niż się wydaje.",
  },
  건록: {
    ko: "건록은 자립의 자리입니다. 자기 기술로 서는 힘이 있고, 간섭을 답답해합니다.",
    es: "Jianlu es autonomía: se sostiene con oficio propio y le ahoga la intromisión.",
    pl: "Geollok to samodzielność: stoi własnym rzemiosłem, a wtrącanie go dusi.",
  },
  제왕: {
    ko: "제왕은 절정의 자리입니다. 리더십과 고집이 한 세트로 오고, 내려놓는 연습이 필요합니다.",
    es: "Diwang es apogeo: liderazgo y terquedad llegan juntos; hay que practicar soltar.",
    pl: "Jewang to szczyt: przywództwo i upór idą w parze; trzeba ćwiczyć odpuszczanie.",
  },
  쇠: {
    ko: "쇠는 기운이 내려오는 자리입니다. 위임·정리·품질 유지가 확장보다 이득입니다.",
    es: "Shuai es descenso: delegar y conservar calidad rinde más que expandir.",
    pl: "Soe to zejście: delegowanie i jakość dają więcej niż ekspansja.",
  },
  병: {
    ko: "병은 점검의 자리입니다. 몸·관계·시스템을 고치는 해가 본업이 되기 쉽습니다.",
    es: "Bing es revisión: cuerpo, vínculo y sistema piden arreglo antes que empuje.",
    pl: "Byeong to przegląd: ciało, relacja i system chcą naprawy przed pędem.",
  },
  사: {
    ko: "사는 마무리의 자리입니다. 끝내지 못한 일이 관계를 붙잡고, 이별·전환이 주제로 올라옵니다.",
    es: "Si es cierre: lo no terminado sujeta el vínculo; aparecen cortes y giros.",
    pl: "Sa to domknięcie: niedokończone trzyma relację; wracają rozstania i zwroty.",
  },
  묘: {
    ko: "묘는 저장과 은둔의 자리입니다. 에너지를 모아 두고, 겉보다 속이 깊습니다.",
    es: "Mu es almacén y retiro: guarda energía; el interior es más hondo que la fachada.",
    pl: "Myo to magazyn i schronienie: zbiera energię; środek jest głębszy niż fasada.",
  },
  절: {
    ko: "절은 리셋의 자리입니다. 끊고 다시 시작하는 힘이 있고, 공백을 견뎌야 다음이 옵니다.",
    es: "Jue es reset: sabe cortar y empezar; hay que aguantar el vacío para que venga lo siguiente.",
    pl: "Jeol to reset: umie ciąć i zaczynać; trzeba wytrzymać pustkę, by przyszło następne.",
  },
  태: {
    ko: "태는 잉태의 자리입니다. 아이디어는 많지만 아직 형태가 없고, 보호와 시간이 필요합니다.",
    es: "Tai es gestación: hay ideas sin forma; pide amparo y tiempo.",
    pl: "Tae to zaczyn: dużo idei bez kształtu; potrzeba osłony i czasu.",
  },
  양: {
    ko: "양은 양육의 자리입니다. 씨앗을 돌보는 리듬이라, 조급히 수확하면 속이 빔.",
    es: "Yang es crianza: ritmo de cuidar la semilla; si cosechas pronto, queda hueco.",
    pl: "Yang to hodowla: rytm pielęgnacji ziarna; szybkie żniwo zostawia pustkę.",
  },
};

const STAGE_EASY: Record<string, Record<Locale, string>> = {
  장생: {
    ko: "지금은 ‘완성’보다 ‘시작해도 되는 이유’를 찾는 리듬이에요. 첫 발을 작게 떼면 전체가 움직입니다.",
    es: "Más que acabar, te toca hallar una razón para empezar. Un paso chico mueve el resto.",
    pl: "Raczej start niż domknięcie. Mały pierwszy krok rusza całość.",
  },
  목욕: {
    ko: "마음이 날씨처럼 바뀌어요. 그 예민함이 매력인데, 상대 표정 하나에 하루를 걸지 마세요.",
    es: "El ánimo cambia como el clima. Esa sensibilidad atrae; no apuestes el día a una cara.",
    pl: "Nastrój zmienia się jak pogoda. Ta czułość przyciąga — nie stawiaj dnia na jedną minę.",
  },
  관대: {
    ko: "보이는 게 곧 실력으로 오해받기 쉬워요. 첫 장면은 다듬고, 속 내용은 두 번째 만남에 꺼내도 됩니다.",
    es: "Confunden tu imagen con tu oficio. Afina la primera escena; el fondo, en el segundo encuentro.",
    pl: "Łatwo wziąć wizerunek za warsztat. Dopracuj pierwszą scenę; głąb zostaw na drugie spotkanie.",
  },
  건록: {
    ko: "혼자 서는 힘이 있어요. 도움은 받되, ‘네가 어떻게 해’ 식의 간섭은 정중히 거르세요.",
    es: "Sabes sostenerte. Acepta ayuda, filtra la intromisión de “hazlo así”.",
    pl: "Umiesz stać sam. Bierz pomoc, odcedzaj wtrącanie w stylu „zrób tak”.",
  },
  제왕: {
    ko: "한창때 리듬이에요. 다만 다 쥐려 하면 사람이 떠나요. 한 가지는 맡기는 게 진짜 힘입니다.",
    es: "Estás en tu tramo alto. Si lo agarras todo, la gente se va. Soltar una cosa es el verdadero poder.",
    pl: "Jesteś w wysokim odcinku. Jak wszystko chwycisz, ludzie odejdą. Oddanie jednej rzeczy to prawdziwa siła.",
  },
  쇠: {
    ko: "늘리기보다 덜어내는 해가 이득이에요. 이미 있는 일의 품질을 한 단계만 올리세요.",
    es: "Más que crecer, conviene quitar. Sube un peldaño la calidad de lo que ya tienes.",
    pl: "Lepiej ujmować niż powiększać. Podnieś o szczebel jakość tego, co już jest.",
  },
  병: {
    ko: "몸이랑 관계가 ‘점검하세요’라고 먼저 말해요. 새 판보다 고치는 판이 맞습니다.",
    es: "Cuerpo y vínculo piden revisión. Más que un tablero nuevo, uno que se repara.",
    pl: "Ciało i relacja mówią „przegląd”. Raczej naprawa niż nowa plansza.",
  },
  사: {
    ko: "끝내지 못한 이야기가 발목을 잡아요. 작별이든 마감이든, 한 줄을 분명히 닫으세요.",
    es: "Lo no cerrado te sujeta. Sea adiós o plazo, cierra una línea con claridad.",
    pl: "Niedomknięte trzyma cię za kostkę. Rozstanie czy deadline — domknij jedną linijkę jasno.",
  },
  묘: {
    ko: "숨고 모으는 시간이 필요해요. 혼자 있는 방을 죄책감으로 만들지 마세요.",
    es: "Necesitas un rato de recoger y esconderte. No conviertas la soledad en culpa.",
    pl: "Potrzebujesz chwili schowania i zbierania. Nie rób z samotności poczucia winy.",
  },
  절: {
    ko: "끊고 리셋하는 힘이 있어요. 공백을 ‘실패’로 보지 말고, 다음 판의 바닥으로 보세요.",
    es: "Sabes cortar y resetear. El vacío no es fracaso: es el suelo del siguiente tablero.",
    pl: "Umiesz ciąć i resetować. Pusta przestrzeń to nie porażka — to podłoga następnej planszy.",
  },
  태: {
    ko: "아직 보여 주기엔 이른 씨앗이에요. 보호하면서 키우고, 발표는 조금 미뤄도 됩니다.",
    es: "La semilla aún no es para mostrar. Críala con amparo; el anuncio puede esperar.",
    pl: "Ziarno jeszcze nie do pokazu. Chroń je; ogłoszenie może poczekać.",
  },
  양: {
    ko: "돌보는 리듬이에요. 급하게 꽃 피우려 하지 말고, 물 주는 일을 루틴으로 두세요.",
    es: "Es ritmo de crianza. No fuerces la flor; haz del riego una rutina.",
    pl: "To rytm hodowli. Nie pchaj kwiatu; podlewanie niech będzie rutyną.",
  },
};

const GROUP_FRONT: Record<GodGroup, Record<Locale, string>> = {
  비겁: {
    ko: "비겁(비견·겁재)이 우세합니다. 동료·경쟁·자립 축이 성격의 뼈대라, 혼자 결정하고 같이 나누는 일이 동시에 열립니다.",
    es: "Dominan los compañeros. Independencia y rivalidad son el hueso: decides solo y a la vez compartes.",
    pl: "Przeważają towarzysze. Kość to samodzielność i rywalizacja: decydujesz sam i jednocześnie dzielisz.",
  },
  식상: {
    ko: "식상(식신·상관)이 우세합니다. 표현·기획·만드는 힘이 먼저 나와, 생각과 말이 결과보다 빨라질 수 있습니다.",
    es: "Domina la expresión. Primero crear y hablar; a veces la idea llega antes que el resultado.",
    pl: "Przeważa wyraz. Najpierw tworzenie i mowa; myśl bywa szybsza niż wynik.",
  },
  재성: {
    ko: "재성(정재·편재)이 우세합니다. 현실·거래·성과·생활비가 선택의 기준이 되고, 감정이 숫자 뒤로 숨기도 합니다.",
    es: "Domina la riqueza. Lo real, el trato y el gasto mandan; a veces el sentimiento se esconde detrás del número.",
    pl: "Przeważa majątek. Realność, transakcja i koszt rządzą; uczucie bywa za liczbą.",
  },
  관성: {
    ko: "관성(정관·편관)이 우세합니다. 책임·평가·규칙·직함이 맞물려, 자유보다 역할이 먼저 보입니다.",
    es: "Domina la autoridad. Cargo, norma y evaluación se traban: el rol se ve antes que la libertad.",
    pl: "Przeważa autorytet. Rola, norma i ocena się spinają: widać funkcję wcześniej niż wolność.",
  },
  인성: {
    ko: "인성(정인·편인)이 우세합니다. 학습·보호·원칙·직관이 뼈대라, 준비는 깊고 실행 타이밍은 늦어질 수 있습니다.",
    es: "Domina la impronta. Estudio, amparo y principio son el hueso: la preparación es honda, el timing puede tardar.",
    pl: "Przeważa pieczęć. Nauka, osłona i zasada to kość: przygotowanie głębokie, timing może się spóźnić.",
  },
};

const GROUP_EASY: Record<GodGroup, Record<Locale, string>> = {
  비겁: {
    ko: "같이 가면 힘이 나고, 지시도 경쟁으로 들릴 때가 있어요. ‘내 몫/네 몫’을 먼저 나누면 싸움이 줄어듭니다.",
    es: "Juntos te dan fuerza, pero una orden suena a competición. Si partes “lo mío / lo tuyo”, baja la pelea.",
    pl: "Razem dodaje siły, ale polecenie brzmi jak wyścig. Jak podzielisz „moje / twoje”, mniej kłótni.",
  },
  식상: {
    ko: "말로 풀고, 만들어서 보여 줘야 속이 시원해요. 대신 70점에 내보내야 결과가 따라옵니다.",
    es: "Te alivia hablar y mostrar lo hecho. El resultado llega si sueltas al 70%.",
    pl: "Ulga, gdy mówisz i pokażesz robotę. Wynik przychodzi, gdy wypuszczasz przy 70%.",
  },
  재성: {
    ko: "현실 숫자가 마음을 안정시켜 줘요. 감정만으로 큰 약속하기 전에, 생활 단위로 한 번 나눠 보세요.",
    es: "Los números reales te calman. Antes de un pacto solo emocional, pártelo en unidades de vida diaria.",
    pl: "Realne liczby uspokajają. Zanim wielka obietnica na samym uczuciu — podziel na dzień codzienny.",
  },
  관성: {
    ko: "역할이 보이면 잘하고, 모호하면 화가 나요. 직함보다 ‘내가 뭘 책임지는지’ 한 줄을 받으세요.",
    es: "Si el rol se ve, rindes; si es vago, te enfadas. Más que el título, una línea de qué es tuyo.",
    pl: "Gdy widać rolę — dajesz radę; gdy mgła — złość. Zamiast tytułu weź linijkę: co jest twoje.",
  },
  인성: {
    ko: "배우고 준비한 뒤에야 마음이 놓여요. 공부 끝은 시험이 아니라 ‘공개한 결과물 하나’로 정하세요.",
    es: "Te tranquilizas al estudiar y preparar. El fin del estudio no es un examen: un resultado publicado.",
    pl: "Spokój, gdy się uczysz i szykujesz. Koniec nauki to nie egzamin — jeden opublikowany wynik.",
  },
};

const LOVE_STYLE: Record<GodGroup, Record<Locale, string>> = {
  비겁: {
    ko: "연애에서도 동료 감각이 강합니다. 독점보다 각자의 판을 존중하는 관계가 오래 갑니다.",
    es: "En el amor pesa el instinto de colega. Dura más quien respeta el tablero de cada uno que quien posee.",
    pl: "W miłości silny instynkt koleżeński. Dłużej trwa szacunek dla planszy każdego niż posiadanie.",
  },
  식상: {
    ko: "표현형입니다. 좋아하는 티, 메시지, 데이트 기획이 먼저 나오고, 침묵은 거절로 오해하기 쉽습니다.",
    es: "Tipo expresivo: primero el gesto, el mensaje, el plan. El silencio se lee como un no.",
    pl: "Typ wyrazisty: najpierw gest, wiadomość, plan. Milczenie łatwo wziąć za odmowę.",
  },
  재성: {
    ko: "생활형입니다. 같이 먹고, 나누고, 약속을 지키는 게 애정 표현이고, 막연한 로맨스만 있으면 불안합니다.",
    es: "Tipo cotidiano: comer, compartir, cumplir es el cariño. Solo romance vago le inquieta.",
    pl: "Typ codzienny: jedzenie, dzielenie, dotrzymywanie to czułość. Sam mglisty romans niepokoi.",
  },
  관성: {
    ko: "조건·책임형입니다. 만남이 공식화되면 잘 지키지만, 애매한 밀당은 스트레스를 만듭니다.",
    es: "Tipo de condición y deber: cuando se formaliza, cumple; el tira y afloja vago le estresa.",
    pl: "Typ warunków i odpowiedzialności: po sformalizowaniu dotrzymuje; mglista gra stresuje.",
  },
  인성: {
    ko: "관찰형입니다. 오래 보고, 맥락을 읽고, 확신이 오면 깊게 들어갑니다. 성급한 고백은 오히려 거리를 만듭니다.",
    es: "Tipo observador: mira largo, lee el contexto, entra hondo cuando está seguro. La confesión prisa aleja.",
    pl: "Typ obserwacyjny: długo patrzy, czyta kontekst, wchodzi głęboko po pewności. Pośpieszne wyznanie oddala.",
  },
};

const STRENGTH_EASY: Record<string, Record<Locale, string>> = {
  "강한 신강": {
    ko: "스스로 밀고 가는 힘이 커요. 그래서 조언이 ‘잔소리’로 들릴 때가 있습니다. 한 명만 브레이크 역할로 두세요.",
    es: "Empujas con fuerza propia. El consejo suena a sermón. Deja a una sola persona de freno.",
    pl: "Pchasz własną siłą. Rada brzmi jak kazanie. Zostaw jedną osobę jako hamulec.",
  },
  중강: {
    ko: "기본 체급은 있는 편이에요. 혼자 다 해도 되지만, 용신 쪽으로 힘을 나눠야 오래 갑니다.",
    es: "Tienes cuerpo de base. Puedes solo, pero duras más si repartes hacia el yongsin.",
    pl: "Masz bazową wagę. Dasz radę sam, ale dłużej pociągniesz, dzieląc siłę ku yongsin.",
  },
  중화: {
    ko: "한쪽으로 극단이 없어요. 대신 선택이 늘 애매해질 수 있으니, 기준 한 줄을 미리 정해 두세요.",
    es: "No hay extremo. Por eso la elección se nubla: fija de antemano una línea de criterio.",
    pl: "Bez skrajności. Dlatego wybór się chwieje — z góry ustal jedną linijkę kryterium.",
  },
  중약: {
    ko: "환경과 사람 도움이 실력의 일부예요. 거절을 못 하면 체력이 먼저 깎이니, 받는 일 전에 회복 시간을 넣으세요.",
    es: "El entorno y la ayuda son parte de tu oficio. Si no sabes decir no, se cae el cuerpo: reserva descanso antes de aceptar.",
    pl: "Otoczenie i pomoc są częścią warsztatu. Jak nie umiesz odmawiać, pada ciało: wstaw odpoczynek przed zgodą.",
  },
  "약한 신약": {
    ko: "많이 떠안으면 금방 방전돼요. 용신(돕는 오행)을 사람·습관으로 먼저 채운 뒤에 큰일을 받으세요.",
    es: "Si cargas mucho, te vacías. Llena primero el yongsin con gente y hábitos, luego acepta lo grande.",
    pl: "Jak za dużo weźmiesz, szybko się rozładujesz. Najpierw napełnij yongsin ludźmi i nawykiem, potem bierz wielkie rzeczy.",
  },
};

const HEALTH_LONG: Record<ElementKey, Record<Locale, string[]>> = {
  wood: {
    ko: [
      "목은 간·담·근골격·눈·힘줄과 상징적으로 연결됩니다. 뻣뻣함, 두통, 눈의 피로는 과한 목 또는 목의 울체 신호로 읽습니다.",
      "월령이 목이거나 목이 강하면 긴장·분노가 근육에 쌓이기 쉽고, 약하면 결단이 늦고 힘줄이 쉽게 지칩니다.",
      "생활 처방은 스트레칭, 걷기, 초록 채광, 오래 앉은 뒤 고개 돌리기입니다. 의학적 진단이 아닙니다.",
    ],
    es: [
      "La madera se asocia a hígado, vesícula, músculo, ojos y tendón. Rigidez, jaqueca y fatiga ocular se leen como exceso o estancamiento.",
      "Si la madera manda o está fuerte, la ira se queda en el músculo; si está débil, tarda el corte y se cansa el tendón.",
      "Hábito: estirar, caminar, luz verde, girar el cuello tras estar sentado. No es diagnóstico.",
    ],
    pl: [
      "Drewno łączy się z wątrobą, pęcherzykiem, mięśniem, okiem i ścięgnem. Sztywność, ból głowy, zmęczenie oczu czyta się jako nadmiar lub zastój.",
      "Gdy drewno rządzi lub jest silne, złość osadza się w mięśniu; gdy słabe — spóźnia się decyzja i ścięgno szybko siada.",
      "Nawyk: rozciąganie, chód, zielone światło, obrót karku po siedzeniu. To nie diagnoza.",
    ],
  },
  fire: {
    ko: [
      "화는 심장·소장·혈맥·수면·염증과 연결됩니다. 과열이면 잠이 얕고 말이 빨라지며, 약하면 의욕과 순환이 떨어집니다.",
      "병화·정화가 강한 원국은 ‘켜진 상태’가 기본값이라, 저녁에 의식적으로 불을 꺼야 합니다.",
      "생활 처방은 취침 고정, 카페인 컷오프, 차갑게 식히기보다 미온과 호흡입니다. 의학적 진단이 아닙니다.",
    ],
    es: [
      "El fuego se asocia a corazón, intestino delgado, vasos, sueño e inflamación. Si hay sobrecalor, el sueño es fino y el habla rápida.",
      "Si Bing/Ding mandan, el valor por defecto es “encendido”: hay que apagar de noche a propósito.",
      "Hábito: hora fija de dormir, corte de cafeína, tibieza y respiración. No es diagnóstico.",
    ],
    pl: [
      "Ogień łączy się z sercem, jelitem cienkim, naczyniami, snem i stanem zapalnym. Przy przegrzaniu sen jest płytki, mowa szybka.",
      "Gdy rządzi Bing/Ding, baza to „włączone”: wieczorem trzeba świadomie gasić.",
      "Nawyk: stała pora snu, odcięcie kofeiny, letniość i oddech. To nie diagnoza.",
    ],
  },
  earth: {
    ko: [
      "토는 비위·소화·습·살·걱정과 연결됩니다. 과하면 더부룩함과 반복 걱정, 약하면 중심이 없고 식사를 거르기 쉽습니다.",
      "토가 매개 오행이라 다른 오행이 충돌할 때 소화가 먼저 반응하는 경우가 많습니다.",
      "생활 처방은 규칙적 식사, 당·야식 줄이기, 따뜻한 음식, ‘걱정 메모 15분’입니다. 의학적 진단이 아닙니다.",
    ],
    es: [
      "La tierra se asocia a bazo/estómago, digestión, humedad y preocupación. El exceso hincha y da vueltas; la falta pierde centro.",
      "Como mediadora, cuando chocan otros elementos a menudo responde primero la digestión.",
      "Hábito: comidas regulares, menos azúcar y cena tardía, comida tibia, 15 minutos de anotación. No es diagnóstico.",
    ],
    pl: [
      "Ziemia łączy się ze śledzioną/żołądkiem, trawieniem, wilgocią i zmartwieniem. Nadmiar puchnie i kręci myślą; niedobór gubi środek.",
      "Jako pośredniczka, przy zderzeniu innych żywiołów często pierwsze reaguje trawienie.",
      "Nawyk: regularne posiłki, mniej cukru i późnej kolacji, ciepłe jedzenie, 15 minut notatki. To nie diagnoza.",
    ],
  },
  metal: {
    ko: [
      "금은 폐·대장·피부·호흡·결단과 연결됩니다. 과하면 건조·비판·예민한 기관지, 약하면 경계가 흐리고 마무리가 늦습니다.",
      "가을 금의 계절이 월령이면 정리와 이별이 주제가 되고, 피부가 먼저 신호를 줍니다.",
      "생활 처방은 가습, 코 호흡, 과한 비판 줄이기, 한 줄 결론 연습입니다. 의학적 진단이 아닙니다.",
    ],
    es: [
      "El metal se asocia a pulmón, intestino grueso, piel, respiración y corte. El exceso reseca y critica; la falta nubla el borde.",
      "Si el mes es de metal, el tema es ordenar y cortar; la piel avisa primero.",
      "Hábito: humedad, respirar por nariz, menos crítica, practicar una línea de conclusión. No es diagnóstico.",
    ],
    pl: [
      "Metal łączy się z płucami, jelitem grubym, skórą, oddechem i cięciem. Nadmiar suszy i krytykuje; niedobór zaciera krawędź.",
      "Gdy miesiąc jest metalu, temat to porządek i rozstanie; skóra daje znać pierwsza.",
      "Nawyk: nawilżenie, oddech nosem, mniej krytyki, ćwiczenie jednej konkluzji. To nie diagnoza.",
    ],
  },
  water: {
    ko: [
      "수는 신장·방광·골반·순환·골수 피로와 연결됩니다. 과하면 생각이 밤에 넘치고, 약하면 두려움을 과로로 덮습니다.",
      "겨울·수 월령이면 저장이 본업이라, 밖으로만 쓰면 허리가 먼저 반응합니다.",
      "생활 처방은 수분, 수면, 하체 보온, 혼자 있는 아침입니다. 의학적 진단이 아닙니다.",
    ],
    es: [
      "El agua se asocia a riñón, vejiga, pelvis, circulación y fatiga profunda. El exceso desborda pensamiento de noche; la falta tapa el miedo con sobrecarga.",
      "Si el mes es de agua, el oficio es guardar; si solo gastas hacia fuera, responde primero la lumbar.",
      "Hábito: agua, sueño, calor en la parte baja, una mañana a solas. No es diagnóstico.",
    ],
    pl: [
      "Woda łączy się z nerkami, pęcherzem, miednicą, krążeniem i głębokim zmęczeniem. Nadmiar wylewa myśli nocą; niedobór przykrywa lęk przepracowaniem.",
      "Gdy miesiąc jest wody, fach to magazynowanie; jak tylko wydajesz na zewnątrz, pierwsza reaguje lędźwie.",
      "Nawyk: woda, sen, ciepło dołu, samotny poranek. To nie diagnoza.",
    ],
  },
};

const FENG_FRONT: Record<ElementKey, Record<Locale, string>> = {
  wood: {
    ko: "목 용신: 동쪽·현관 근처 식물, 세로로 긴 가구, 나무 질감, 아침 햇살이 들어오는 창. 직사각 동선이 목의 생장을 돕습니다.",
    es: "Yongsin madera: este, planta junto a la entrada, mueble vertical, veta de madera, sol de mañana. El eje recto ayuda a crecer.",
    pl: "Yongsin drewno: wschód, roślina przy wejściu, mebel pionowy, słoje drewna, poranne słońce. Prosta oś pomaga wzrostowi.",
  },
  fire: {
    ko: "화 용신: 남쪽·조명·촛불·따뜻한 직물. 식사 공간을 밝히고, 차갑고 푸른 조명만 가득한 방은 화를 죽입니다.",
    es: "Yongsin fuego: sur, luz, vela, tejido cálido. Ilumina el comer; una sala solo de luz fría apaga el fuego.",
    pl: "Yongsin ogień: południe, światło, świeca, ciepła tkanina. Rozjaśnij jedzenie; sama zimna lampa gasi ogień.",
  },
  earth: {
    ko: "토 용신: 중앙·남서, 낮은 수납, 도자기, 안정된 바닥. 어지러운 바닥은 토가 습에 잠기는 것과 같아 먼저 치웁니다.",
    es: "Yongsin tierra: centro/suroeste, mueble bajo, cerámica, suelo firme. El suelo caótico es humedad: se recoge primero.",
    pl: "Yongsin ziemia: środek/południowy zachód, niska szafka, ceramika, stała podłoga. Bałagan na podłodze to wilgoć — sprzątaj pierwsze.",
  },
  metal: {
    ko: "금 용신: 서쪽·둥근 금속·종·정리된 선. 날카로운 물건의 과잉보다 ‘깨끗한 한 줄’이 금을 살립니다.",
    es: "Yongsin metal: oeste, metal redondo, campana, línea limpia. Más que filos de más, una línea nítida nutre el metal.",
    pl: "Yongsin metal: zachód, okrągły metal, dzwon, czysta linia. Zamiast nadmiaru ostrzy — jedna wyraźna kreska karmi metal.",
  },
  water: {
    ko: "수 용신: 북쪽·거울 한 점·낮은 물그릇·남색 패브릭·곡선 동선. 거울을 마주 보게 많이 두면 수가 넘칩니다.",
    es: "Yongsin agua: norte, un espejo, cuenco bajo, tela índigo, curva. Demasiados espejos frente a frente desbordan el agua.",
    pl: "Yongsin woda: północ, jedno lustro, niska miseczka, granat, łuk. Za dużo luster naprzeciw siebie wylewa wodę.",
  },
};

const COLOR_MEANING: Record<ElementKey, Record<Locale, string>> = {
  wood: {
    ko: "목 색(청록·연두·나무갈색)은 시작·성장·회복의 보완색입니다. 옷깃·노트·책상 매트처럼 ‘매일 손이 가는 곳’에 두면 효과가 분명합니다.",
    es: "Los verdes y el marrón madera complementan inicio y recobro. Mejor en cuello, libreta, tapete: sitios que tocas cada día.",
    pl: "Zieleń i brąz drewna uzupełniają start i odzysk. Kołnierz, notes, mata — miejsca, których dotykasz codziennie.",
  },
  fire: {
    ko: "화 색(주홍·진홍·자색)은 표현·온기·사교의 보완색입니다. 포인트로 쓰고, 방 전체를 빨강으로 칠하면 과열입니다.",
    es: "Cinabrio, rojo y púrpura complementan expresión y calor. Úsalos de acento; pintar toda la sala de rojo es sobrecalor.",
    pl: "Cynober, czerwień i purpura uzupełniają wyraz i ciepło. Akcent, nie całe pomieszczenie na czerwono — to przegrzanie.",
  },
  earth: {
    ko: "토 색(황금·베이지·황토)은 안정·소화·중심의 보완색입니다. 바닥·쿠션·식기처럼 무게 있는 면에 두면 공간이 가라앉습니다.",
    es: "Ámbar, beige y ocre complementan centro y digestión. En suelo, cojín y loza el espacio se asienta.",
    pl: "Bursztyn, beż i ochra uzupełniają środek i trawienie. Podłoga, poduszka, naczynia — przestrzeń siada.",
  },
  metal: {
    ko: "금 색(한지 흰빛·금·은)은 정리·결단·품위의 보완색입니다. 여백이 곧 색입니다. 잡동사니를 줄이는 것이 금 색을 입는 일입니다.",
    es: "Blanco hanji, oro y plata complementan orden y corte. El vacío es el color. Quitar trastos es vestir metal.",
    pl: "Biel hanji, złoto i srebro uzupełniają ład i cięcie. Pusta przestrzeń jest kolorem. Wyrzucenie rupieci to ubranie metalu.",
  },
  water: {
    ko: "수 색(남색·회청·먹색)은 깊이·직관·휴식의 보완색입니다. 잠자리·가방 안쪽처럼 남에게 안 보이는 면에 두면 과하지 않습니다.",
    es: "Índigo, azul gris y tinta complementan profundidad y descanso. En cama o forro de bolsa, donde nadie ve, no sobra.",
    pl: "Granat, szaroniebieski i tusz uzupełniają głębię i odpoczynek. Łóżko, podszewka torby — tam, gdzie nikt nie widzi, nie przesadza.",
  },
};

const SINSAL_NOTE: Record<string, Record<Locale, string>> = {
  도화: {
    ko: "도화가 있어 시선과 매력이 잘 붙습니다. 연애 사건으로 단정하지 말고, 인기·이미지·감정 기복의 채널로 읽습니다.",
    es: "Hay flor de melocotón: se pega la mirada. No es un caso amoroso fijo; canal de imagen y vaivén emocional.",
    pl: "Jest kwiat brzoskwini: wzrok łatwo przylega. To nie wyrok romansu — kanał wizerunku i wahań.",
  },
  역마: {
    ko: "역마가 있어 이동·이직·출장·바깥 활동이 기본값에 가깝습니다. 한 자리에 묶이면 몸부터 반응합니다.",
    es: "Hay caballo de postas: mudanza, viaje, afuera son el valor por defecto. Atado a un sitio, responde el cuerpo.",
    pl: "Jest koń stacyjny: przeprowadzka, wyjazd, zewnątrz to baza. Przywiązany do miejsca — reaguje ciało.",
  },
  화개: {
    ko: "화개가 있어 혼자만의 세계, 연구·예술·철학이 숨을 쉬는 통로입니다. 고립과 몰입을 구분해야 합니다.",
    es: "Hay cubierta de flor: el mundo a solas, arte y estudio respiran. Hay que separar aislamiento de inmersión.",
    pl: "Jest kwiatowa pokrywa: świat w pojedynkę, sztuka i nauka oddychają. Oddziel izolację od immersji.",
  },
  괴강살: {
    ko: "괴강은 결단·카리스마·고집이 한 세트입니다. 리더십으로 쓰면 자산, 독선으로 쓰면 사람이 떠납니다.",
    es: "Goegang es corte, carisma y terquedad juntos. Liderazgo es activo; capricho ahuyenta gente.",
    pl: "Goegang to cięcie, charyzma i upór w komplecie. Przywództwo jest aktywem; samowola odpycha ludzi.",
  },
  백호대살: {
    ko: "백호는 예민함과 날카로움의 경고입니다. 사고·수술·갈등을 예언하지 않고, 신경·수면·말의 날을 관리하라는 표시로 봅니다.",
    es: "Tigre blanco avisa sensibilidad aguda. No predice accidente: pide cuidar nervio, sueño y filo de la palabra.",
    pl: "Biały tygrys ostrzega o ostrości. Nie wróży wypadku: każe dbać o nerwy, sen i ostrze słowa.",
  },
  공망: {
    ko: "공망은 비어 있음입니다. 형식보다 본질, 소속보다 거리. 허무가 아니라 ‘필요 없는 것을 안 쥐는 힘’으로 쓰면 됩니다.",
    es: "El vacío es estar hueco: esencia antes que forma. No es nihilismo: es no agarrar lo que no hace falta.",
    pl: "Pustka to bycie wydrążonym: istota przed formą. To nie nihilizm — siła, by nie chwytać zbędnego.",
  },
  천을귀인: {
    ko: "천을귀인은 어려울 때 사람·기회가 나타나는 길성입니다. 만능 해결사가 아니라, 도움을 받을 구멍을 열어 두라는 뜻입니다.",
    es: "Cheon-eul es estrella de ayuda en apuro. No resuelve todo: deja abierto el hueco para recibir.",
    pl: "Cheoneul to gwiazda pomocy w tarapatach. Nie załatwia wszystkiego: zostaw lukę na przyjęcie pomocy.",
  },
  문창귀인: {
    ko: "문창은 글·학습·자격·표현의 길성입니다. 말로 남기는 일이 이 사주의 자산이 됩니다.",
    es: "Munchang favorece letra, estudio y expresión. Lo que dejas por escrito se vuelve activo.",
    pl: "Munchang sprzyja pismu, nauce i wyrazowi. To, co zostawiasz słowem, staje się aktywem.",
  },
};

export function twelveFront(stage: string, locale: Locale): string {
  return trio(locale, STAGE_FRONT, stage, {
    ko: `12운성 ${stage}이 일지에 있어 관계와 자기 리듬의 기본값이 됩니다.`,
    es: `La etapa ${stage} en la rama del día fija el ritmo de vínculo y de uno mismo.`,
    pl: `Etap ${stage} w gałęzi dnia ustawia rytm relacji i własny.`,
  });
}

export function twelveEasy(stage: string, locale: Locale): string {
  return trio(locale, STAGE_EASY, stage, {
    ko: `관계에서 ${stage} 리듬이 반복됩니다.`,
    es: `En el vínculo se repite el ritmo ${stage}.`,
    pl: `W relacji powtarza się rytm ${stage}.`,
  });
}

export function twelveLabel(stage: string, locale: Locale): string {
  return term(TWELVE_STAGE_NAME, stage, locale);
}

export function groupFront(group: GodGroup, locale: Locale): string {
  return GROUP_FRONT[group][locale];
}

export function groupEasy(group: GodGroup, locale: Locale): string {
  return GROUP_EASY[group][locale];
}

export function loveStyle(group: GodGroup, locale: Locale): string {
  return LOVE_STYLE[group][locale];
}

export function groupLabel(group: GodGroup, locale: Locale): string {
  return term(GOD_GROUP_NAME, group, locale);
}

export function strengthEasy(classification: string, locale: Locale): string {
  return STRENGTH_EASY[classification]?.[locale] ?? STRENGTH_EASY["중화"][locale];
}

export function healthLong(element: ElementKey, locale: Locale): string[] {
  return HEALTH_LONG[element][locale];
}

export function fengFront(element: ElementKey, locale: Locale): string {
  return FENG_FRONT[element][locale];
}

export function colorMeaning(element: ElementKey, locale: Locale): string {
  return COLOR_MEANING[element][locale];
}

export function sinsalNotes(names: string[], locale: Locale, limit = 3): string[] {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const name of names) {
    const line = SINSAL_NOTE[name]?.[locale];
    if (!line || seen.has(name)) continue;
    seen.add(name);
    lines.push(line);
    if (lines.length >= limit) break;
  }
  return lines;
}

export function topGodFront(god: string, locale: Locale): string {
  const label = tenGod(god, locale);
  const table: Record<string, Record<Locale, string>> = {
    비견: {
      ko: `주도 십성은 ${label}입니다. 동료와 나란히 서되 자존을 지키는 태도가 기본값입니다.`,
      es: `El dios guía es ${label}: estar al lado del colega sin soltar la dignidad.`,
      pl: `Gwiazda wiodąca to ${label}: stać obok kolegi, nie puszczając godności.`,
    },
    겁재: {
      ko: `주도 십성은 ${label}입니다. 행동이 빠르고 나눔과 쟁탈이 한끝 차이입니다.`,
      es: `El dios guía es ${label}: actúa pronto; compartir y disputar están a un filo.`,
      pl: `Gwiazda wiodąca to ${label}: szybki ruch; dzielenie i spór są o ostrze.`,
    },
    식신: {
      ko: `주도 십성은 ${label}입니다. 만들고 베푸는 여유가 재능이며, 마감만 붙이면 복이 됩니다.`,
      es: `El dios guía es ${label}: crear y dar con holgura; el plazo lo vuelve fortuna.`,
      pl: `Gwiazda wiodąca to ${label}: tworzyć i dawać z luzem; deadline zamienia to w fortunę.`,
    },
    상관: {
      ko: `주도 십성은 ${label}입니다. 비판·재능·반골이 한 세트라, 표현을 일로 바꾸면 자산이 됩니다.`,
      es: `El dios guía es ${label}: crítica, talento y rebeldía juntos; si lo vuelves oficio, es activo.`,
      pl: `Gwiazda wiodąca to ${label}: krytyka, talent i bunt w komplecie; jako fach — aktyw.`,
    },
    편재: {
      ko: `주도 십성은 ${label}입니다. 기회와 유동 자산에 감각이 있고, 한곳에 묶인 돈은 답답합니다.`,
      es: `El dios guía es ${label}: olfato para oportunidad y lo líquido; el dinero atado le ahoga.`,
      pl: `Gwiazda wiodąca to ${label}: węch do okazji i płynności; związana kasa dusi.`,
    },
    정재: {
      ko: `주도 십성은 ${label}입니다. 성실·저축·약속된 현금이 마음을 안정시키고, 도박형 한 방은 체질이 아닙니다.`,
      es: `El dios guía es ${label}: el efectivo prometido calma; el golpe de azar no es tu cuerpo.`,
      pl: `Gwiazda wiodąca to ${label}: obiecana gotówka uspokaja; jednorazowy łup to nie twoja budowa.`,
    },
    편관: {
      ko: `주도 십성은 ${label}입니다. 압박을 연료로 쓰지만, 적이 너무 많으면 몸과 평판이 먼저 깎입니다.`,
      es: `El dios guía es ${label}: usa la presión de combustible; si sobran enemigos, caen cuerpo y nombre.`,
      pl: `Gwiazda wiodąca to ${label}: presja jest paliwem; przy nadmiarze wrogów pada ciało i imię.`,
    },
    정관: {
      ko: `주도 십성은 ${label}입니다. 규범과 직함이 뼈대라, 역할이 분명한 판에서 실력이 드러납니다.`,
      es: `El dios guía es ${label}: norma y cargo son el hueso; el oficio se ve en un tablero con rol claro.`,
      pl: `Gwiazda wiodąca to ${label}: norma i urząd to kość; warsztat widać na planszy z jasną rolą.`,
    },
    편인: {
      ko: `주도 십성은 ${label}입니다. 비정통 학습과 직관이 재능이며, 정석만 강요하면 숨이 막힙니다.`,
      es: `El dios guía es ${label}: estudio irregular e intuición; si le imponen solo el canon, se ahoga.`,
      pl: `Gwiazda wiodąca to ${label}: nietypowa nauka i intuicja; sam kanon go dusi.`,
    },
    정인: {
      ko: `주도 십성은 ${label}입니다. 배움과 보호가 자산이며, 준비만 하다 시장을 놓치지 않게 공개 주기를 정해야 합니다.`,
      es: `El dios guía es ${label}: estudio y amparo son activo; fija un ciclo de publicar para no perder el mercado.`,
      pl: `Gwiazda wiodąca to ${label}: nauka i osłona to aktyw; ustal cykl publikacji, by nie zgubić rynku.`,
    },
  };
  return table[god]?.[locale] ?? loc(locale, `주도 십성은 ${label}입니다.`, `El dios guía es ${label}.`, `Gwiazda wiodąca to ${label}.`);
}

export function fortuneLine(text: string, locale: Locale): string {
  return prose(text, locale);
}

export function careerWorkEasy(type: string | undefined, locale: Locale): string {
  const table: Record<string, Record<Locale, string>> = {
    창업형: {
      ko: "만들어 보여주는 쪽이 맞아요. 지시만 받는 자리는 금방 답답해지고, 내 이름으로 남는 결과물이 연료입니다.",
      es: "Te sienta crear y mostrar. Un puesto solo de órdenes te ahoga; el resultado con tu nombre es el combustible.",
      pl: "Pasuje ci tworzyć i pokazywać. Samo wykonywanie poleceń dusi; paliwem jest wynik z twoim nazwiskiem.",
    },
    콘텐츠형: {
      ko: "만들고 알리는 리듬이 직업이 됩니다. 매일 사람만 상대하는 창구보다, 작품이 남는 채널이 오래 갑니다.",
      es: "Crear y publicar se vuelve oficio. Dura más un canal con obra que una ventanilla de gente todo el día.",
      pl: "Tworzenie i publikacja stają się fachem. Dłużej trwa kanał z dziełem niż okienko ludzi przez cały dzień.",
    },
    연구형: {
      ko: "깊게 파는 일이 맞아요. 매일 사람만 상대하면 방전되니, 혼자 읽는 오전을 근무 시간의 일부로 지키세요.",
      es: "Te sienta profundizar. Si solo atiendes gente, te vacías: guarda una mañana de lectura como parte del trabajo.",
      pl: "Pasuje ci kopać w głąb. Sam kontakt z ludźmi cię opróżnia: zostaw poranek czytania jako część etatu.",
    },
    전문직형: {
      ko: "자격과 깊이가 단가가 되는 자리예요. 잡무가 전문을 삼키지 않게, ‘이 일만은 내 것’을 문서화하세요.",
      es: "El título y la hondura marcan tu tarifa. Para que lo extra no trague lo experto, documenta “esto es mío”.",
      pl: "Kwalifikacja i głębia to twoja stawka. Żeby chałtura nie pożarła fachu, spisz „to jest moje”.",
    },
    조직형: {
      ko: "사람과 규칙을 같이 다루는 자리가 오래 가요. 혼자 다 만들려 하지 말고, 역할을 나누는 쪽이 승진 축입니다.",
      es: "Te dura un puesto con gente y normas. No lo hagas todo solo: repartir roles es el eje de ascenso.",
      pl: "Dłużej wytrzymasz przy ludziach i zasadach. Nie rób wszystkiego sam: podział ról to oś awansu.",
    },
    공무원형: {
      ko: "시험·규율·공적 책임이 체질에 가깝습니다. 즉흥 사업보다, 절차가 있는 판에서 신뢰가 쌓입니다.",
      es: "Examen, norma y deber público te sientan. Más que un negocio improvisado, un tablero con procedimiento acumula fe.",
      pl: "Egzamin, norma i obowiązek publiczny ci leżą. Zamiast improwizowanego biznesu — plansza z procedurą buduje zaufanie.",
    },
    기술직형: {
      ko: "손으로, 시스템으로, 반복 가능한 기술로 남는 일이 맞아요. 말만 많은 회의는 최소로 줄이세요.",
      es: "Te sienta lo que queda en la mano, el sistema, la técnica repetible. Recorta las juntas de solo hablar.",
      pl: "Pasuje to, co zostaje w ręku, systemie, powtarzalnej technice. Tnij zebrania z samą gadką.",
    },
    기획형: {
      ko: "읽고 설계하고 판을 짜는 자리가 맞아요. 실행 파트너를 옆에 두지 않으면 기획만 쌓입니다.",
      es: "Te sienta leer, diseñar y armar el tablero. Sin un socio de ejecución, solo se apila el plan.",
      pl: "Pasuje czytać, projektować i stawiać planszę. Bez partnera wykonania — sama sterta planów.",
    },
    영업형: {
      ko: "사람과 숫자를 동시에 움직이는 자리예요. 거절을 개인 거절로 듣지 않는 훈련이 수입을 지킵니다.",
      es: "Mueves gente y cifras a la vez. Entrenar a no oír el no como rechazo personal guarda el ingreso.",
      pl: "Ruszasz ludzi i cyfry naraz. Trening, by nie słyszeć „nie” jako osobistej odmowy, chroni przychód.",
    },
    투자형: {
      ko: "기회와 리스크를 다루는 감각이 있어요. 다만 한 번에 올인하지 말고, 한도와 정산 주기를 먼저 고정하세요.",
      es: "Tienes olfato de oportunidad y riesgo. No all-in: fija techo y ciclo de liquidación primero.",
      pl: "Masz węch do okazji i ryzyka. Nie all-in: najpierw limit i cykl rozliczenia.",
    },
  };
  return table[type ?? ""]?.[locale] ?? loc(
    locale,
    "일하는 리듬은 분명해요. 프로젝트 하나, 마감 하나, 내가 책임지는 덩어리가 있으면 속도가 납니다.",
    "El ritmo de trabajo es claro: un proyecto, un plazo, un bloque tuyo, y sale velocidad.",
    "Rytm pracy jest jasny: jeden projekt, jeden deadline, jeden twój kawałek — i idzie tempo.",
  );
}

export function wealthEasyByStyle(style: InvestStyle, locale: Locale): string[] {
  if (style === "stable") {
    return [
      loc(
        locale,
        "한 번에 크게 먹기보다, 새는 구멍부터 막는 편이 마음이 편해요. 자동이체·고정 저축이 이 사주의 기본 장비입니다.",
        "Mejor tapar fugas que apostar a lo grande. La transferencia automática es tu equipo de serie.",
        "Lepiej zatkać wycieki, niż jeść wszystko naraz. Automatyczny przelew to twoje fabryczne wyposażenie.",
      ),
      loc(
        locale,
        "기회가 보여도 한도 안에서만 움직이세요. ‘안 잃는 해’가 모이면 그게 공격형보다 큰 수익이 됩니다.",
        "Aunque veas oportunidad, muévete dentro del techo. Los años de no perder suman más que un golpe agresivo.",
        "Nawet jak widać okazję, ruszaj w limicie. Lata bez straty składają się na więcej niż agresywny strzał.",
      ),
    ];
  }
  if (style === "aggressive") {
    return [
      loc(
        locale,
        "기회가 보이면 몸이 먼저 반응해요. 그 감각은 자산이지만, 한 번에 올인하면 원국의 변동이 손실로 고정됩니다.",
        "Si ves oportunidad, el cuerpo responde. Ese olfato es activo; el all-in fija la oscilación natal como pérdida.",
        "Jak widzisz okazję, ciało reaguje. Ten węch to aktyw; all-in zamienia wahanie karty na stratę.",
      ),
      loc(
        locale,
        "베팅은 ‘작은 실험 여러 개’로 쪼개고, 정산 없는 공동투자·보증은 이 사주의 구멍입니다.",
        "Parte la apuesta en experimentos chicos. La inversión conjunta sin liquidar y el aval son tu fuga.",
        "Stawkę dziel na małe eksperymenty. Wspólna inwestycja bez rozliczenia i poręczenie to twoja dziura.",
      ),
    ];
  }
  return [
    loc(
      locale,
      "벌 때와 지킬 때를 나누면 덜 흔들려요. 수입의 반은 실험, 반은 고정 저장이 이 사주의 기본값입니다.",
      "Separa ganar y guardar. Mitad experimento, mitad depósito fijo: ese es tu valor por defecto.",
      "Oddziel zarabianie od trzymania. Pół eksperymentu, pół stałego depozytu — twoja baza.",
    ),
    loc(
      locale,
      "공격만 하면 잔고가 안 남고, 안정만 하면 기회가 지나갑니다. 분기마다 비율만 다시 정하세요.",
      "Si solo atacas, no queda saldo; si solo te cubres, pasa la oportunidad. Reajusta el ratio cada trimestre.",
      "Samo atakowanie — brak salda; samo krycie — okazja ucieka. Co kwartał ustaw proporcję od nowa.",
    ),
  ];
}

export function palaceLine(ctx: ThemeCtx): string {
  const { locale, p } = ctx;
  return loc(
    locale,
    `궁성으로 읽으면 년주 ${p.year.ganzhiKorean}은 초년·조상·친구 층, 월주 ${p.month.ganzhiKorean}은 부모·사회·직장 층, 일주 ${p.day.ganzhiKorean}은 배우자·동거·자기 몸, 시주는 자녀·말년·하루 리듬입니다.`,
    `Por palacios: año ${p.year.ganzhi} = inicio/amigos; mes ${p.month.ganzhi} = sociedad/trabajo; día ${p.day.ganzhi} = pareja/cuerpo; hora = hijos/vejez/ritmo diario.`,
    `Pałace: rok ${p.year.ganzhi} = początek/przyjaciele; miesiąc ${p.month.ganzhi} = społeczeństwo/praca; dzień ${p.day.ganzhi} = para/ciało; godzina = dzieci/późne lata/rytm dnia.`,
  );
}
