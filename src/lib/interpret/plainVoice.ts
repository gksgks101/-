import type { Locale } from "@/lib/i18n/config";
import { hasBatchim } from "@/lib/i18n/josa";
import type { ElementKey } from "@/lib/saju/types";
import { loc } from "./themeContext";

export function pick<T>(items: T[], seed: number): T {
  const index = Math.abs(seed) % items.length;
  return items[index] ?? items[0];
}

export function easyElementName(element: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "시작", es: "arranque", pl: "start" },
    fire: { ko: "표현", es: "expresión", pl: "wyraz" },
    earth: { ko: "실속", es: "concreto", pl: "konkret" },
    metal: { ko: "판단", es: "criterio", pl: "osąd" },
    water: { ko: "깊이", es: "calma", pl: "głębia" },
  };
  return table[element][locale];
}

export function luckOpensWhen(element: ElementKey, locale: Locale, seed = 0): string {
  const table: Record<ElementKey, Record<Locale, string[]>> = {
    wood: {
      ko: [
        "새로운 일을 시작할 때 운이 열려요.",
        "방향을 먼저 정할 때 길이 보여요.",
        "산책을 하며 계획을 적을 때 숨이 트여요.",
        "작은 첫 발을 뗄 때 하루가 움직여요.",
        "창문을 열고 아침을 맞을 때 기운이 돌아요.",
        "한 줄 목표를 적으면 발이 가벼워져요.",
        "미뤄 둔 시작을 오늘 열면 길이 열려요.",
        "짧은 산책만으로도 생각이 정리돼요.",
      ],
      es: [
        "La suerte se abre cuando empiezas algo nuevo.",
        "El camino se ve cuando eliges rumbo pronto.",
        "Respiras si paseas y anotas un plan.",
        "Un primer paso chico mueve el día.",
        "Si abres la ventana a la mañana, vuelve el ánimo.",
        "Una línea de meta aligera el paso.",
        "Si hoy abres lo aplazado, sale el camino.",
        "Un paseo corto ya ordena el pensamiento.",
      ],
      pl: [
        "Szczęście się otwiera, gdy zaczynasz coś nowego.",
        "Droga widać, gdy szybko bierzesz kurs.",
        "Łapiesz oddech, gdy spacerujesz i zapisujesz plan.",
        "Mały pierwszy krok rusza dzień.",
        "Jak otworzysz okno na poranek, wraca siła.",
        "Jedna linijka celu robi lżejszy krok.",
        "Jak dziś otworzysz odłożone, wychodzi droga.",
        "Krótki spacer już porządkuje myśl.",
      ],
    },
    fire: {
      ko: [
        "생각을 밖으로 표현할 때 운이 열려요.",
        "마음을 말과 온기로 나눌 때 길이 보여요.",
        "사람을 따뜻하게 부를 때 자리가 밝아져요.",
        "감정을 한 줄로 말할 때 관계가 풀려요.",
        "작은 칭찬을 먼저 건네면 하루가 밝아져요.",
        "얼굴을 보고 말하면 오해가 줄어요.",
        "따뜻한 한 끼가 말을 부드럽게 해요.",
        "저녁엔 기기보다 사람 쪽을 보세요.",
      ],
      es: [
        "La suerte se abre cuando sacas lo que piensas.",
        "El camino se ve cuando compartes calor y palabras.",
        "El sitio se ilumina si llamas a la gente con calor.",
        "Si dices el ánimo en una línea, el vínculo se abre.",
        "Un elogio chico primero ilumina el día.",
        "Si hablas cara a cara, baja el malentendido.",
        "Una comida tibia suaviza la palabra.",
        "De noche mira más a la gente que a la pantalla.",
      ],
      pl: [
        "Szczęście się otwiera, gdy mówisz, co myślisz.",
        "Droga widać, gdy dzielisz ciepło i słowa.",
        "Miejsce się świeci, gdy wołasz ludzi ciepłem.",
        "Jak powiesz serce jedną linijką, relacja się otwiera.",
        "Mała pochwała najpierw rozświetla dzień.",
        "Jak mówisz twarzą w twarz, mniej nieporozumień.",
        "Ciepły posiłek zmiękcza słowo.",
        "Wieczorem patrz bardziej na ludzi niż na ekran.",
      ],
    },
    earth: {
      ko: [
        "약속을 지키고 실속을 챙길 때 운이 열려요.",
        "일상을 차근히 붙들 때 길이 보여요.",
        "밥을 따뜻하게 챙길 때 마음이 가라앉아요.",
        "바닥을 정리하면 하루가 붙어 있어요.",
        "작은 심부름을 끝내면 마음이 놓여요.",
        "같은 시간에 밥 먹으면 리듬이 붙어요.",
        "약속 시간을 지키면 신뢰가 쌓여요.",
        "집을 따뜻하게 두면 몸이 먼저 고마워해요.",
      ],
      es: [
        "La suerte se abre cuando cumples y cuidas lo concreto.",
        "El camino se ve cuando sujetas el día a día.",
        "El ánimo se asienta si cuidas una comida tibia.",
        "Si recoges el suelo, el día se pega.",
        "Un recado chico cerrado te deja el pecho quieto.",
        "Comer a la misma hora pega el ritmo.",
        "Si cumples la hora, se acumula la fe.",
        "Una casa tibia agradece el cuerpo primero.",
      ],
      pl: [
        "Szczęście się otwiera, gdy dotrzymujesz i dbasz o konkret.",
        "Droga widać, gdy trzymasz codzienność.",
        "Serce siada, gdy dbasz o ciepły posiłek.",
        "Jak posprzątasz podłogę, dzień się klei.",
        "Mała załatwiona sprawa uspokaja serce.",
        "Jedzenie o tej samej porze klei rytm.",
        "Jak dotrzymasz godziny, składa się zaufanie.",
        "Ciepły dom dziękuje ciałem najpierw.",
      ],
    },
    metal: {
      ko: [
        "기준을 세우고 결정을 내릴 때 운이 열려요.",
        "한 줄을 분명히 자를 때 길이 보여요.",
        "할 일을 끝내 두면 머리가 맑아져요.",
        "여백을 남기는 선택이 품격을 지켜요.",
        "필요 없는 알림을 끄면 판단이 빨라져요.",
        "오늘 할 일 세 개만 적으면 돼요.",
        "거절 한 줄을 연습하면 하루가 가벼워져요.",
        "책상을 비우면 결정이 또렷해져요.",
      ],
      es: [
        "La suerte se abre cuando fijas un criterio y decides.",
        "El camino se ve cuando cortas una línea clara.",
        "La cabeza se aclara si cierras una tarea.",
        "Dejar aire en la elección guarda el tono.",
        "Si apagas avisos de más, el criterio acelera.",
        "Basta anotar tres tareas de hoy.",
        "Una línea de no aligera el día.",
        "Si vacías el escritorio, la decisión se ve.",
      ],
      pl: [
        "Szczęście się otwiera, gdy stawiasz kryterium i decydujesz.",
        "Droga widać, gdy tniesz jedną jasną linijkę.",
        "Głowa się czyszczy, gdy domykasz zadanie.",
        "Zostawienie oddechu w wyborze broni klasy.",
        "Jak wyłączysz zbędne powiadomienia, osąd przyspiesza.",
        "Wystarczą trzy zadania na dziś.",
        "Jedna linijka odmowy robi lżejszy dzień.",
        "Jak opróżnisz biurko, decyzja się wyostrza.",
      ],
    },
    water: {
      ko: [
        "쉬고 깊게 생각할 때 운이 열려요.",
        "혼자 있는 아침을 지킬 때 길이 보여요.",
        "물을 가까이 두면 생각이 맑아져요.",
        "밤을 조금 일찍 닫으면 직관이 돌아와요.",
        "짧은 일기가 속을 가라앉혀 줘요.",
        "산책길에 말없이 걸으면 답이 떠요.",
        "잠들기 전 화면을 끄면 꿈이 덜 어지러워요.",
        "혼자 있는 20분이 하루를 지켜 줘요.",
      ],
      es: [
        "La suerte se abre cuando descansas y piensas hondo.",
        "El camino se ve cuando guardas una mañana a solas.",
        "El pensamiento se aclara si acercas el agua.",
        "Si cierras la noche un poco antes, vuelve la intuición.",
        "Un diario corto asienta el pecho.",
        "Si caminas en silencio, aparece la respuesta.",
        "Apagar la pantalla antes de dormir aclara el sueño.",
        "Veinte minutos a solas guardan el día.",
      ],
      pl: [
        "Szczęście się otwiera, gdy odpoczywasz i myślisz głęboko.",
        "Droga widać, gdy strzeżesz samotnego poranka.",
        "Myśl się czyszczy, gdy trzymasz wodę blisko.",
        "Jak wcześniej zamkniesz noc, wraca intuicja.",
        "Krótki dziennik uspokaja serce.",
        "Jak idziesz milcząc, pojawia się odpowiedź.",
        "Wyłączenie ekranu przed snem czyści marzenia.",
        "Dwadzieścia minut samemu strzeże dnia.",
      ],
    },
  };
  return pick(table[element][locale], seed);
}

export function helpAction(element: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "새로운 시작", es: "un comienzo nuevo", pl: "nowy start" },
    fire: { ko: "밖으로 꺼내는 표현", es: "sacar lo que piensas", pl: "mówienie na głos" },
    earth: { ko: "약속과 실속", es: "cumplir y lo concreto", pl: "obietnica i konkret" },
    metal: { ko: "기준과 결단", es: "criterio y decisión", pl: "kryterium i decyzja" },
    water: { ko: "쉼과 깊이", es: "descanso y calma", pl: "odpoczynek i głębia" },
  };
  return table[element][locale];
}

export function helpClause(elements: ElementKey[], locale: Locale): string {
  const unique = [...new Set(elements)];
  const clause: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "새로운 일을 시작하고", es: "empiezas algo nuevo", pl: "zaczynasz nowe sprawy" },
    fire: { ko: "생각을 밖으로 표현하고", es: "sacas lo que piensas", pl: "mówisz, co myślisz" },
    earth: { ko: "실속 있는 약속으로 바꾸고", es: "lo vuelves concreto", pl: "zamieniasz to w konkret" },
    metal: { ko: "기준을 세우고", es: "fijas un criterio", pl: "stawiasz kryterium" },
    water: { ko: "깊게 쉬고", es: "descansas hondo", pl: "odpoczywasz głęboko" },
  };
  if (!unique.length) {
    return loc(locale, "재능으로 표현하면", "Si sacas tu talento,", "Jeśli wyjmiesz talent,");
  }
  if (locale === "ko") {
    const parts = unique.map((key) => clause[key].ko);
    const last = parts[parts.length - 1] ?? "";
    return [...parts.slice(0, -1), last.replace(/고$/, "면")].join(" ");
  }
  const parts = unique.map((key) => clause[key][locale]);
  const last = parts[parts.length - 1] ?? "";
  const head = parts.slice(0, -1);
  if (locale === "es") {
    const joined = head.length ? `${head.join(", ")} y ${last}` : last;
    return `Si ${joined},`;
  }
  const joined = head.length ? `${head.join(", ")} i ${last}` : last;
  return `Jeśli ${joined},`;
}

export function cautionTrait(element: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "고집과 너무 빠른 시작", es: "terquedad y un inicio demasiado rápido", pl: "upór i zbyt szybki start" },
    fire: { ko: "과한 말과 얕은 잠", es: "hablar de más y sueño fino", pl: "nadmiar słów i płytki sen" },
    earth: { ko: "걱정이 반복되는 일상", es: "la preocupación que da vueltas", pl: "zmartwienie kręcące się w kółko" },
    metal: { ko: "너무 날카로운 말", es: "una palabra demasiado aguda", pl: "zbyt ostre słowo" },
    water: { ko: "생각이 밤에 넘치기", es: "pensamientos que se desbordan de noche", pl: "myśli wylewające się nocą" },
  };
  return table[element][locale];
}

export function muchTrait(element: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "시작이 빠르고 방향이 분명해요.", es: "Empiezas pronto y se ve el rumbo.", pl: "Zaczynasz szybko i widać kurs." },
    fire: { ko: "자리를 밝히고 사람이 모여요.", es: "Iluminas el sitio y se junta gente.", pl: "Rozświetlasz miejsce i zbierają się ludzie." },
    earth: { ko: "신뢰를 주고 일상을 붙들어요.", es: "Das confianza y sujetas el día.", pl: "Dajesz zaufanie i trzymasz dzień." },
    metal: { ko: "판단이 빠르고 원칙을 중요하게 여겨요.", es: "El criterio es rápido y te importa la norma.", pl: "Osąd jest szybki i ważna jest zasada." },
    water: { ko: "시야가 넓고 생각이 깊어요.", es: "La mirada es ancha y el pensamiento hondo.", pl: "Szerokie pole i głęboka myśl." },
  };
  return table[element][locale];
}

export function littleTrait(element: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "유연하고 충돌을 피해요.", es: "Eres flexible y evitas el choque.", pl: "Jesteś giętki i omijasz zderzenie." },
    fire: { ko: "차분하고 과열이 없어요.", es: "Hay calma y no te quemas.", pl: "Jest spokój i nie ma przegrzania." },
    earth: { ko: "몸이 가볍고 변화에 열려요.", es: "El cuerpo es ligero y te abres al cambio.", pl: "Ciało lekkie, otwarte na zmianę." },
    metal: { ko: "사람에게 부드러워요.", es: "Eres suave con la gente.", pl: "Jesteś miękki wobec ludzi." },
    water: { ko: "실행이 빠르고 생각이 덜 맴돌아요.", es: "Ejecutas pronto y el pensamiento no da vueltas.", pl: "Szybkie wykonanie, myśl nie kręci się w kółko." },
  };
  return table[element][locale];
}

export function personFit(element: ElementKey, locale: Locale, flavor: "love" | "match" = "match"): { label: string; why: string } {
  const table: Record<ElementKey, Record<Locale, { label: string; why: string }>> = {
    wood: {
      ko: { label: "방향을 잡아 주는 사람", why: "시작할 때 옆에서 응원해 주면 숨이 트여요." },
      es: { label: "Quien te da rumbo", why: "Si te anima al empezar, respiras." },
      pl: { label: "Kto daje ci kurs", why: "Jak dopingują na starcie, łapiesz oddech." },
    },
    fire: {
      ko: { label: "마음을 편하게 꺼내 주는 사람", why: "감정을 받아 주면 관계가 오래 가요." },
      es: { label: "Quien te deja sacar el ánimo", why: "Si recibe tu emoción, el vínculo dura." },
      pl: { label: "Kto pozwala wyjąć serce", why: "Jak przyjmie emocję, relacja trwa." },
    },
    earth: {
      ko: { label: "약속을 지키는 든든한 사람", why: "말보다 일상이 맞으면 마음이 놓여요." },
      es: { label: "Quien cumple lo dicho", why: "Si encaja el día a día, te calmas." },
      pl: { label: "Kto dotrzymuje słowa", why: "Gdy zgadza się codzienność, jest spokój." },
    },
    metal: {
      ko: { label: "기준이 분명하고 솔직한 사람", why: "애매한 밀당보다 한 줄이 편해요." },
      es: { label: "Quien es claro y honesto", why: "Más que el tira y afloja, te sienta una línea." },
      pl: { label: "Kto jest jasny i szczery", why: "Zamiast gry na zwłokę wygodna jest jedna linijka." },
    },
    water: {
      ko: { label: "말없이 들어 주는 사람", why: "서두르지 않는 속도가 이 결에 맞아요." },
      es: { label: "Quien escucha sin prisa", why: "Un ritmo sin prisa encaja con tu temple." },
      pl: { label: "Kto słucha bez pośpiechu", why: "Tempo bez pędu pasuje do twojego temperamentu." },
    },
  };
  const base = table[element][locale];
  if (flavor === "love") {
    const why: Record<ElementKey, Record<Locale, string>> = {
      wood: {
        ko: "연애에서는 응원이 시작을 열어 줘요.",
        es: "En el amor, el ánimo abre el inicio.",
        pl: "W miłości doping otwiera start.",
      },
      fire: {
        ko: "연애에서는 감정을 받아 줘야 오래 가요.",
        es: "En el amor dura si reciben tu emoción.",
        pl: "W miłości trwa, gdy przyjmą emocję.",
      },
      earth: {
        ko: "연애에서는 일상이 맞아야 마음이 놓여요.",
        es: "En el amor te calmas si encaja el día a día.",
        pl: "W miłości serce siada, gdy zgadza się codzienność.",
      },
      metal: {
        ko: "연애에서는 한 줄이 밀당보다 편해요.",
        es: "En el amor te sienta una línea más que el tira y afloja.",
        pl: "W miłości wygodniejsza jest linijka niż gra na zwłokę.",
      },
      water: {
        ko: "연애에서는 서두르지 않는 속도가 맞아요.",
        es: "En el amor te sienta un ritmo sin prisa.",
        pl: "W miłości pasuje tempo bez pędu.",
      },
    };
    return { label: base.label, why: why[element][locale] };
  }
  return base;
}

export function personCaution(element: ElementKey, locale: Locale, flavor: "love" | "match" = "match"): { label: string; why: string } {
  const table: Record<ElementKey, Record<Locale, { label: string; why: string }>> = {
    wood: {
      ko: { label: "내 속도를 무시하는 사람", why: "밀어붙이기만 하면 마음이 닫혀요." },
      es: { label: "Quien ignora tu ritmo", why: "Si solo empuja, te cierras." },
      pl: { label: "Kto ignoruje twoje tempo", why: "Jak tylko pcha, zamykasz się." },
    },
    fire: {
      ko: { label: "감정을 깔보는 사람", why: "온기를 무시하면 관계가 식어요." },
      es: { label: "Quien menosprecia el ánimo", why: "Si ignora el calor, el vínculo se enfría." },
      pl: { label: "Kto lekceważy emocje", why: "Jak zignoruje ciepło, relacja stygnie." },
    },
    earth: {
      ko: { label: "약속을 쉽게 바꾸는 사람", why: "말이 바뀌면 신뢰가 먼저 깨져요." },
      es: { label: "Quien cambia lo pactado", why: "Si cambia de palabra, cae la fe." },
      pl: { label: "Kto łatwo zmienia umowę", why: "Jak zmienia zdanie, pęka zaufanie." },
    },
    metal: {
      ko: { label: "정답만 던지는 사람", why: "자르기만 하면 자존심 싸움이 나요." },
      es: { label: "Quien solo suelta “la verdad”", why: "Si solo corta, nace pelea de orgullo." },
      pl: { label: "Kto rzuca samą „prawdę”", why: "Jak tylko tnie, rodzi się spór o honor." },
    },
    water: {
      ko: { label: "침묵을 거절로 몰아가는 사람", why: "생각할 틈을 안 주면 거리를 둬요." },
      es: { label: "Quien lee el silencio como un no", why: "Si no deja pensar, pones distancia." },
      pl: { label: "Kto milczenie bierze za odmowę", why: "Jak nie da pomyśleć, stawiasz dystans." },
    },
  };
  const base = table[element][locale];
  if (flavor === "love") {
    const why: Record<ElementKey, Record<Locale, string>> = {
      wood: {
        ko: "밀어붙이면 연애에서 마음이 닫혀요.",
        es: "Si empuja, el amor se cierra.",
        pl: "Jak pcha, miłość się zamyka.",
      },
      fire: {
        ko: "온기를 무시하면 연애가 식어요.",
        es: "Si ignora el calor, el amor se enfría.",
        pl: "Jak zignoruje ciepło, miłość stygnie.",
      },
      earth: {
        ko: "말이 바뀌면 연애 신뢰가 먼저 깨져요.",
        es: "Si cambia de palabra, cae la fe en el amor.",
        pl: "Jak zmieni zdanie, pęka zaufanie w miłości.",
      },
      metal: {
        ko: "자르기만 하면 연애가 자존심 싸움이 돼요.",
        es: "Si solo corta, el amor se vuelve pelea de orgullo.",
        pl: "Jak tylko tnie, miłość staje się sporem o honor.",
      },
      water: {
        ko: "생각할 틈을 안 주면 연애에서 거리를 둬요.",
        es: "Si no deja pensar, pones distancia en el amor.",
        pl: "Jak nie da pomyśleć, w miłości stawiasz dystans.",
      },
    };
    return { label: base.label, why: why[element][locale] };
  }
  return base;
}

export function joinHelp(elements: ElementKey[], locale: Locale): string {
  const names = [...new Set(elements)].map((key) => helpAction(key, locale));
  if (!names.length) return loc(locale, "재능을 밖으로 꺼내는 일", "sacar tu talento", "wyjąć talent");
  if (names.length === 1) return names[0];
  if (locale === "es") return names.join(" y ");
  if (locale === "pl") return names.join(" i ");
  return names.join(" · ");
}

export function ira(noun: string): string {
  return hasBatchim(noun) ? "이라" : "라";
}

export function tenGodEasy(god: string, locale: Locale): string {
  const table: Record<string, Record<Locale, string>> = {
    비견: { ko: "혼자 서는 힘", es: "sostenerte solo", pl: "stać sam" },
    겁재: { ko: "경쟁과 나눔", es: "competir y compartir", pl: "rywalizacja i dzielenie" },
    식신: { ko: "만들고 베풂", es: "crear y dar", pl: "tworzyć i dawać" },
    상관: { ko: "말과 재능", es: "palabra y talento", pl: "słowo i talent" },
    편재: { ko: "움직이는 기회", es: "oportunidad en movimiento", pl: "okazja w ruchu" },
    정재: { ko: "지키는 약속", es: "la cita que se cumple", pl: "dotrzymana obietnica" },
    편관: { ko: "압박과 책임", es: "presión y deber", pl: "presja i obowiązek" },
    정관: { ko: "역할과 규칙", es: "rol y norma", pl: "rola i zasada" },
    편인: { ko: "직관 공부", es: "estudio con intuición", pl: "nauka z intuicją" },
    정인: { ko: "배움과 보호", es: "estudio y amparo", pl: "nauka i osłona" },
  };
  return table[god]?.[locale] ?? loc(locale, "자기 자리", "tu propio sitio", "własne miejsce");
}
