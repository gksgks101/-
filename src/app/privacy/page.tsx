export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 leading-8">
      <p className="text-xs tracking-[0.3em] text-[var(--gold)]">PRIVACY</p>
      <h1 className="pillar-gan mt-3 text-4xl">개인정보처리방침</h1>
      <p className="mt-8 text-[var(--muted)]">
        이 서비스는 사주 분석을 위해 이름, 성별, 생년월일, 출생시간을 입력받습니다. 이름·생년월일·출생시간은 민감한
        개인정보로 취급합니다.
      </p>
      <h2 className="mt-10 text-xl">최소 수집</h2>
      <p className="text-[var(--muted)]">
        기본값은 분석 종료 후 서버에 저장하지 않는 구조입니다. 결과는 사용자 브라우저의 임시 저장소(sessionStorage)에만
        남으며, 결과 화면의 ‘입력값 삭제’로 지울 수 있습니다.
      </p>
      <h2 className="mt-10 text-xl">이름과 계산의 분리</h2>
      <p className="text-[var(--muted)]">
        이름은 사주 계산에 사용하지 않습니다. 화면 표시용입니다. AI를 사용할 때도 이름은 전송하지 않으며, 이미 계산된
        사주 JSON만 전달합니다.
      </p>
      <h2 className="mt-10 text-xl">AI 호출</h2>
      <p className="text-[var(--muted)]">
        LLM API 키는 서버 환경변수로만 보관합니다. 브라우저에 노출하지 않습니다. AI에게 생년월일만 주고 사주를 다시
        계산하게 하지 않습니다.
      </p>
      <h2 className="mt-10 text-xl">고지</h2>
      <p className="text-[var(--muted)]">본 서비스의 해석은 명리학적 참고 자료이며 의료, 투자, 법률 판단을 대체하지 않습니다.</p>
    </article>
  );
}
