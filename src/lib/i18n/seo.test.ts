import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./seo";

describe("사이트 URL", () => {
  it("saju.app 플레이스홀더는 건너뛰고 Vercel 주소를 쓴다", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://saju.app",
        VERCEL_PROJECT_PRODUCTION_URL: "pi-lilac-36.vercel.app",
      }),
    ).toBe("https://pi-lilac-36.vercel.app");
  });

  it("환경 값이 없으면 실제 배포 주소를 쓴다", () => {
    expect(resolveSiteUrl({})).toBe("https://pi-lilac-36.vercel.app");
  });
});
