export type CalendarType = "solar" | "lunar";
export type GenderType = "male" | "female";
export type TimeKnowledge = "exact" | "approximate" | "unknown";
export type TimeAccuracy = "exact" | "about_1h" | "about_2_3h" | "uncertain";
export type ElementKey = "wood" | "fire" | "earth" | "metal" | "water";
export type YinYang = "yang" | "yin";
export type HiddenStemRole = "main" | "middle" | "residual";
export type StrengthClass = "강한 신강" | "중강" | "중화" | "중약" | "약한 신약";
export type PillarKey = "year" | "month" | "day" | "hour";

export interface BirthInput {
  name?: string;
  gender: GenderType;
  calendar: CalendarType;
  date: string;
  isLeapMonth?: boolean;
  timeKnowledge: TimeKnowledge;
  time?: string;
  timeRangeStart?: string;
  timeRangeEnd?: string;
  timeAccuracy?: TimeAccuracy;
  country: string;
  city: string;
  residenceCountry?: string;
  residenceCity?: string;
  useLocalMeanCorrection?: boolean;
  useYajaSi?: boolean;
  useTrueSolarTime?: boolean;
}

export interface StemInfo {
  gan: string;
  ganKorean: string;
  element: ElementKey;
  elementKorean: string;
  yinYang: YinYang;
}

export interface HiddenStem {
  gan: string;
  ganKorean: string;
  element: ElementKey;
  tenGod: string;
  tenGodKorean: string;
  role: HiddenStemRole;
  roleKorean: string;
}

export interface Pillar {
  gan: string;
  zhi: string;
  ganzhi: string;
  ganKorean: string;
  zhiKorean: string;
  ganzhiKorean: string;
  ganElement: ElementKey;
  zhiElement: ElementKey;
  ganTenGod: string;
  ganTenGodKorean: string;
  zhiTenGod: string;
  zhiTenGodKorean: string;
  twelveStage: string;
  twelveStageKorean: string;
  hiddenStems: HiddenStem[];
  naeum: string;
}

export interface ElementCount {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface ElementStrength {
  wood: "강" | "중" | "약";
  fire: "강" | "중" | "약";
  earth: "강" | "중" | "약";
  metal: "강" | "중" | "약";
  water: "강" | "중" | "약";
}

export interface RelationHit {
  type: string;
  typeKorean: string;
  items: string[];
  description: string;
}

export interface SinsalItem {
  name: string;
  category: "gwiin" | "sinsal" | "void";
  positions: string[];
  summary: string;
}

export interface GuimunAnalysis {
  present: boolean;
  pairs: string[];
  overlap: boolean;
  dayBranchRelation: string;
  monthBranchRelation: string;
  natalActivation: "없음" | "약" | "중간" | "강";
  daeunActivation: string[];
  seunActivation: string[];
  traits: string[];
  disclaimer: string;
}

export interface StrengthAnalysis {
  score: number;
  classification: StrengthClass;
  reasons: string[];
  monthCommand: boolean;
  rooted: boolean;
  gainedSeason: boolean;
  gainedBranch: boolean;
  gainedPower: boolean;
}

export interface UseGodAnalysis {
  yongsin: string[];
  heesin: string[];
  gisin: string[];
  gusin: string[];
  reasons: string[];
}

export interface DaeunItem {
  startAge: number;
  endAge: number;
  gan: string;
  zhi: string;
  ganzhi: string;
  ganzhiKorean: string;
  tenGod: string;
  tenGodKorean: string;
  elements: string[];
  stars: number;
  keywords: string[];
  money: string;
  career: string;
  love: string;
  health: string;
  relationship: string;
  caution: string;
  opportunity: string;
}

export interface SeunItem {
  year: number;
  age: number;
  gan: string;
  zhi: string;
  ganzhi: string;
  ganzhiKorean: string;
  tenGod: string;
  tenGodKorean: string;
  element: ElementKey;
  relationsWithNatal: string[];
  relationsWithDaeun: string[];
  sinsalChanges: string[];
  stars: number;
  summary: string;
  career: string;
  money: string;
  love: string;
}

export interface SeasonInfo {
  currentJieqi: string;
  currentJieqiKorean: string;
  previousJieqi: string;
  previousJieqiKorean: string;
  nextJieqi: string;
  nextJieqiKorean: string;
  monthOrder: string;
  monthOrderKorean: string;
  jieqiTime: string;
}

export interface BoundaryCase {
  label: string;
  time: string;
  hourBranch: string;
  hourBranchKorean: string;
  hourPillar: string;
}

export interface HourBoundaryWarning {
  crossesBoundary: boolean;
  message: string;
  cases: BoundaryCase[];
}

export interface PatternAnalysis {
  name: string;
  basis: string;
  summary: string;
}

export interface TypeScore {
  type: string;
  score: number;
  reasons: string[];
}

export interface WeaknessItem {
  title: string;
  type: string;
  severity: number;
  cause: string;
  pattern: string;
  realLife: string[];
  cost: string;
  remedy: string;
}

export interface StrengthItem {
  title: string;
  basis: string;
  ability: string;
  careers: string[];
  sideEffect: string;
  amplify: string;
}

export interface SajuCalculation {
  birth: {
    displayName: string;
    gender: GenderType;
    calendar: CalendarType;
    inputDate: string;
    solarDate: string;
    lunarDate: string;
    isLeapMonth: boolean;
    time: string | null;
    timeKnowledge: TimeKnowledge;
    timezone: string;
    location: string;
    usedTrueSolarTime: boolean;
    usedYajaSi: boolean;
    effectiveDateTime: string;
  };
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
  dayMaster: StemInfo;
  elements: {
    stemCount: ElementCount;
    branchCount: ElementCount;
    hiddenCount: ElementCount;
    simpleCount: ElementCount;
    powerScore: ElementCount;
    powerLabel: ElementStrength;
  };
  hiddenStems: Record<PillarKey, HiddenStem[]>;
  tenGods: Record<string, number>;
  twelveStages: Record<PillarKey, string>;
  voidBranches: string[];
  sinsal: SinsalItem[];
  gwiin: SinsalItem[];
  relations: RelationHit[];
  season: SeasonInfo;
  strength: StrengthAnalysis;
  useGod: UseGodAnalysis;
  pattern: PatternAnalysis;
  daeun: DaeunItem[];
  seun: SeunItem[];
  guimun: GuimunAnalysis;
  wealthTypes: TypeScore[];
  careerTypes: TypeScore[];
  weaknesses: WeaknessItem[];
  talents: StrengthItem[];
  hourBoundary: HourBoundaryWarning | null;
  alternatives: SajuCalculation[] | null;
  evidence: string[];
}

export interface ReportSection {
  id: string;
  title: string;
  locked: boolean;
  paragraphs: string[];
  bullets?: string[];
}

export interface InterpretationReport {
  source: "rules" | "llm";
  sections: ReportSection[];
  disclaimer: string;
}

export interface HourCandidate {
  time: string;
  zhi: string;
  zhiKorean: string;
  ganzhi: string;
  ganzhiKorean: string;
  isCurrent: boolean;
}

export interface AnalyzeResponse {
  calculation: SajuCalculation;
  report: InterpretationReport;
  privacy: {
    nameUsedForDisplayOnly: true;
    birthDataSentToAi: false;
    stored: false;
  };
  hourCandidates?: HourCandidate[];
  shareInput?: {
    gender: GenderType;
    calendar: CalendarType;
    date: string;
    isLeapMonth?: boolean;
    timeKnowledge: TimeKnowledge;
    time?: string;
    timeRangeStart?: string;
    timeRangeEnd?: string;
    timeAccuracy?: TimeAccuracy;
    country: string;
    city: string;
    useLocalMeanCorrection?: boolean;
    useYajaSi?: boolean;
    useTrueSolarTime?: boolean;
  };
}
