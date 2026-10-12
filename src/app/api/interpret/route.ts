import { NextResponse } from "next/server";
import { interpretWithLlm } from "@/lib/interpret/llm";
import type { SajuCalculation } from "@/lib/saju/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { calculation?: SajuCalculation };
    if (!body.calculation?.pillars?.day) {
      return NextResponse.json({ error: "계산 데이터가 없습니다." }, { status: 400 });
    }
    const report = await interpretWithLlm(body.calculation);
    return NextResponse.json({ report });
  } catch {
    return NextResponse.json({ error: "해석 요청에 실패했습니다." }, { status: 500 });
  }
}
