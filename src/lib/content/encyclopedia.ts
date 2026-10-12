import type { Locale } from "@/lib/i18n/config";
import { ANIMAL_SLUG, STEM_SLUG } from "./slugs";
import { BRANCHES, BRANCH_META, STEMS } from "@/lib/saju/constants";
import { DAY_MASTER_CARDS } from "@/lib/saju/dayCards";
import { loc } from "@/lib/interpret/themeContext";
import { stemEasyLine } from "@/lib/interpret/themes";

export interface ContentPage {
  slug: string;
  gan?: string;
  zhi?: string;
  title: Record<Locale, string>;
  lead: Record<Locale, string>;
  body: Record<Locale, string[]>;
}

const ANIMAL_NAME: Record<string, Record<Locale, string>> = {
  子: { ko: "쥐", es: "Rata", pl: "Szczur" },
  丑: { ko: "소", es: "Buey", pl: "Bawół" },
  寅: { ko: "호랑이", es: "Tigre", pl: "Tygrys" },
  卯: { ko: "토끼", es: "Conejo", pl: "Królik" },
  辰: { ko: "용", es: "Dragón", pl: "Smok" },
  巳: { ko: "뱀", es: "Serpiente", pl: "Wąż" },
  午: { ko: "말", es: "Caballo", pl: "Koń" },
  未: { ko: "양", es: "Cabra", pl: "Koza" },
  申: { ko: "원숭이", es: "Mono", pl: "Małpa" },
  酉: { ko: "닭", es: "Gallo", pl: "Kogut" },
  戌: { ko: "개", es: "Perro", pl: "Pies" },
  亥: { ko: "돼지", es: "Cerdo", pl: "Świnia" },
};

const ANIMAL_BODY: Record<string, Record<Locale, string[]>> = {
  子: {
    ko: [
      "자수는 밤의 물입니다. 시작하고 숨고, 틈을 봅니다.",
      "해의 띠만으로 성격을 단정하지 마세요. 일간이 ‘나’이고, 띠는 초년·가족 층의 기후입니다.",
      "생일만 넣으면 내 일간 카드와 네 기둥을 볼 수 있습니다.",
    ],
    es: [
      "La rata es agua de noche: empieza, se esconde, mira el hueco.",
      "El animal del año no fija el carácter. El tronco del día eres tú; el animal es el clima de la familia y la infancia.",
      "Con tu fecha salen tu carta de tronco y los cuatro pilares.",
    ],
    pl: [
      "Szczur to nocna woda: zaczyna, chowa się, patrzy w lukę.",
      "Zwierzę roku nie ustala charakteru. Pień dnia to ty; zwierzę to klimat rodziny i dzieciństwa.",
      "Z daty wychodzi karta pnia i cztery filary.",
    ],
  },
  丑: {
    ko: [
      "축토는 겨울 땅입니다. 참고 쌓으며, 늦게 열립니다.",
      "소띠는 끈기로 읽히지만, 일간이 불이면 겉과 속이 다를 수 있습니다.",
      "띠는 입구입니다. 사주 카드가 본문입니다.",
    ],
    es: [
      "El buey es tierra de invierno: aguanta, acumula, abre tarde.",
      "Se lee como tesón, pero si tu tronco es fuego el dentro y el fuera pueden diferir.",
      "El animal es la puerta. Las cartas de saju son el texto.",
    ],
    pl: [
      "Bawół to zimowa ziemia: znosi, zbiera, otwiera się późno.",
      "Czyta się jako wytrwałość, ale gdy pień to ogień, środek i wierzch mogą się różnić.",
      "Zwierzę to drzwi. Karty saju to tekst.",
    ],
  },
  寅: {
    ko: [
      "인목은 봄의 호랑이입니다. 방향이 먼저 나오고 움직임이 큽니다.",
      "개척의 해 기운이지, 매일의 말투는 일간이 정합니다.",
      "내 사주를 보려면 생일만 있으면 됩니다.",
    ],
    es: [
      "El tigre es madera de primavera: primero la dirección, luego el salto.",
      "Es el clima de apertura; el habla diaria la fija el tronco.",
      "Para ver tu saju basta la fecha de nacimiento.",
    ],
    pl: [
      "Tygrys to wiosenne drewno: najpierw kierunek, potem skok.",
      "To klimat otwarcia; codzienną mowę ustala pień.",
      "Żeby zobaczyć saju, wystarczy data urodzenia.",
    ],
  },
  卯: {
    ko: [
      "묘목은 토끼입니다. 부드럽고 빠르게, 충돌보다 길을 바꿉니다.",
      "예민함은 재능일 수 있습니다. 일간이 쇠면 결이 달라집니다.",
      "띠 다음엔 일간 카드를 보세요.",
    ],
    es: [
      "El conejo es madera fina: suave y rápido, cambia de camino antes que chocar.",
      "La sensibilidad puede ser oficio. Si el tronco es metal, el grano cambia.",
      "Después del animal, mira la carta del tronco.",
    ],
    pl: [
      "Królik to cienkie drewno: miękki i szybki, zmienia drogę zamiast zderzenia.",
      "Wrażliwość może być rzemiosłem. Gdy pień to metal, splot się zmienia.",
      "Po zwierzęciu zobacz kartę pnia.",
    ],
  },
  辰: {
    ko: [
      "진토는 용입니다. 습한 흙이 물과 나무를 품습니다.",
      "스케일이 커 보이지만, 실제 추진력은 일간·월지가 가릅니다.",
      "생일로 여덟 글자를 확인하세요.",
    ],
    es: [
      "El dragón es tierra húmeda: acoge agua y madera.",
      "Se ve grande; el empujón real lo cortan tronco y mes.",
      "Con la fecha confirmas las ocho letras.",
    ],
    pl: [
      "Smok to wilgotna ziemia: obejmuje wodę i drewno.",
      "Wygląda na wielki; realny pęd tną pień i miesiąc.",
      "Datą potwierdzasz osiem znaków.",
    ],
  },
  巳: {
    ko: [
      "사화는 뱀입니다. 불을 숨기고, 한 점을 오래 봅니다.",
      "지혜로 읽히지만 일간이 물하면 전략이 달라집니다.",
      "사주 카드가 띠보다 구체적입니다.",
    ],
    es: [
      "La serpiente es fuego guardado: mira un punto largo rato.",
      "Se lee como sabiduría; si el tronco es agua, la estrategia cambia.",
      "Las cartas de saju son más concretas que el animal.",
    ],
    pl: [
      "Wąż to schowany ogień: długo patrzy w jeden punkt.",
      "Czyta się jako mądrość; gdy pień to woda, strategia się zmienia.",
      "Karty saju są konkretniejsze niż zwierzę.",
    ],
  },
  午: {
    ko: [
      "오화는 말입니다. 한낮의 불, 드러내고 달립니다.",
      "열정은 해의 기후입니다. 매일의 회복은 일간이 정합니다.",
      "생일만 넣으면 올해 카드까지 나옵니다.",
    ],
    es: [
      "El caballo es fuego de mediodía: se muestra y corre.",
      "La pasión es el clima del año. El recobro diario lo fija el tronco.",
      "Con la fecha salen también las cartas de este año.",
    ],
    pl: [
      "Koń to ogień południa: pokazuje się i biegnie.",
      "Pasja to klimat roku. Codzienny odzysk ustala pień.",
      "Z daty wychodzą też karty tego roku.",
    ],
  },
  未: {
    ko: [
      "미토는 양입니다. 여름 끝의 흙, 사람을 모으고 남깁니다.",
      "온기는 년지입니다. 거절의 방식은 일간이 가르칩니다.",
      "내 일간을 보려면 사주 계산으로 가세요.",
    ],
    es: [
      "La cabra es tierra de fin de verano: reúne y deja resto.",
      "El calor es la rama del año. El modo de decir no lo enseña el tronco.",
      "Para ver tu tronco, entra al cálculo de saju.",
    ],
    pl: [
      "Koza to ziemia końca lata: zbiera ludzi i zostawia resztę.",
      "Ciepło to gałąź roku. Sposób odmawiania uczy pień.",
      "Żeby zobaczyć swój pień, wejdź w liczenie saju.",
    ],
  },
  申: {
    ko: [
      "신금은 원숭이입니다. 쇠가 움직여 길을 바꿉니다.",
      "재치로 읽히지만, 원칙은 일간이 금인지 목인지에 달립니다.",
      "띠는 한 글자입니다. 여덟 글자를 보세요.",
    ],
    es: [
      "El mono es metal en movimiento: cambia de camino.",
      "Se lee como ingenio; la norma depende de si el tronco es metal o madera.",
      "El animal es una letra. Mira las ocho.",
    ],
    pl: [
      "Małpa to metal w ruchu: zmienia drogę.",
      "Czyta się jako spryt; zasada zależy, czy pień to metal czy drewno.",
      "Zwierzę to jeden znak. Zobacz osiem.",
    ],
  },
  酉: {
    ko: [
      "유금은 닭입니다. 잘린 쇠, 기준이 선명합니다.",
      "결벽·완성으로 읽히지만 일간이 흙이면 사람을 먼저 챙깁니다.",
      "생일로 내 카드를 확인하세요.",
    ],
    es: [
      "El gallo es metal cortado: el criterio se ve.",
      "Se lee como acabado; si el tronco es tierra, cuida primero a la gente.",
      "Confirma tus cartas con la fecha.",
    ],
    pl: [
      "Kogut to ucięty metal: kryterium widać.",
      "Czyta się jako domknięcie; gdy pień to ziemia, najpierw ogarnia ludzi.",
      "Potwierdź karty datą urodzenia.",
    ],
  },
  戌: {
    ko: [
      "술토는 개입니다. 건조한 흙, 경계와 지킴입니다.",
      "의리로 읽히지만 충이 오면 이동이 커질 수 있습니다.",
      "년지만 보지 말고 일간 카드를 여세요.",
    ],
    es: [
      "El perro es tierra seca: límite y guarda.",
      "Se lee como lealtad; si llega un choque, el traslado puede crecer.",
      "No mires solo el año: abre la carta del tronco.",
    ],
    pl: [
      "Pies to sucha ziemia: granica i straż.",
      "Czyta się jako lojalność; gdy przyjdzie zderzenie, przeprowadzka może urosnąć.",
      "Nie patrz tylko na rok: otwórz kartę pnia.",
    ],
  },
  亥: {
    ko: [
      "해수는 돼지입니다. 큰물, 품고 흘러 겨울로 갑니다.",
      "여유로 읽히지만 일간이 불이면 속도가 다릅니다.",
      "사주는 띠가 아니라 여덟 글자의 관계입니다.",
    ],
    es: [
      "El cerdo es agua grande: acoge, fluye, entra al invierno.",
      "Se lee como holgura; si el tronco es fuego, el ritmo cambia.",
      "El saju no es el animal: es la relación de ocho letras.",
    ],
    pl: [
      "Świnia to wielka woda: obejmuje, płynie, wchodzi w zimę.",
      "Czyta się jako luz; gdy pień to ogień, tempo jest inne.",
      "Saju to nie zwierzę: to relacja ośmiu znaków.",
    ],
  },
};

export const STEM_PAGES: ContentPage[] = STEMS.map((gan) => {
  const card = DAY_MASTER_CARDS[gan];
  return {
    slug: STEM_SLUG[gan],
    gan,
    title: card.title,
    lead: {
      ko: stemEasyLine(gan, "ko"),
      es: stemEasyLine(gan, "es"),
      pl: stemEasyLine(gan, "pl"),
    },
    body: {
      ko: [card.subtitle.ko, ...card.keywords.ko.map((word) => `키워드: ${word}`).slice(0, 1), "생일만 넣으면 이 일간이 내 것인지 바로 나옵니다. 사주 계산으로 이어 보세요."],
      es: [card.subtitle.es, `Claves: ${card.keywords.es.join(" · ")}.`, "Con tu fecha ves al momento si este tronco es el tuyo. Sigue al cálculo."],
      pl: [card.subtitle.pl, `Słowa: ${card.keywords.pl.join(" · ")}.`, "Z daty od razu widać, czy to twój pień. Przejdź do liczenia."],
    },
  };
});

export const ANIMAL_PAGES: ContentPage[] = BRANCHES.map((zhi) => ({
  slug: ANIMAL_SLUG[zhi],
  zhi,
  title: {
    ko: `${BRANCH_META[zhi].korean} · ${ANIMAL_NAME[zhi].ko}`,
    es: `${ANIMAL_NAME[zhi].es}`,
    pl: `${ANIMAL_NAME[zhi].pl}`,
  },
  lead: {
    ko: loc("ko", `${ANIMAL_NAME[zhi].ko}띠는 년지 ${BRANCH_META[zhi].korean}입니다.`, "", ""),
    es: `${ANIMAL_NAME[zhi].es}: rama del año ${zhi}.`,
    pl: `${ANIMAL_NAME[zhi].pl}: gałąź roku ${zhi}.`,
  },
  body: ANIMAL_BODY[zhi],
}));

export function stemPage(slug: string): ContentPage | undefined {
  return STEM_PAGES.find((item) => item.slug === slug);
}

export function animalPage(slug: string): ContentPage | undefined {
  return ANIMAL_PAGES.find((item) => item.slug === slug);
}
