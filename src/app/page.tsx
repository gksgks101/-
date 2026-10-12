import { BirthForm } from "@/components/BirthForm";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-16">
      <p className="mb-3 text-center text-xs tracking-[0.35em] text-[var(--gold)]">MODERN MYEONGRI</p>
      <h1 className="pillar-gan mb-4 text-center text-4xl leading-tight sm:text-5xl">
        당신의 사주를
        <br />
        읽어드립니다.
      </h1>
      <p className="mb-10 text-center text-[var(--muted)]">
        생년월일과 출생시간을 입력하면
        <br />
        만세력 계산 → 명리 구조 → 상담 리포트가 순서대로 나옵니다.
      </p>
      <div className="rounded-3xl border border-[var(--line)] bg-[#12100d]/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <BirthForm />
      </div>
      <div className="mt-10 grid gap-3 text-sm text-[var(--muted)]">
        <p>① 사주 계산은 항상 같은 답을 내는 프로그램이 합니다.</p>
        <p>② AI는 계산을 하지 않고, 이미 나온 숫자만 문장으로 풀이합니다.</p>
        <p>③ 이름은 화면에만 쓰이며 분석 엔진과 AI에는 넣지 않습니다.</p>
      </div>
    </div>
  );
}
