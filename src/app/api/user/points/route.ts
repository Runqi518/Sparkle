import { NextResponse } from "next/server";
import { getUserPoints } from "@/lib/generation";

export async function GET() {
  try {
    const points = await getUserPoints();
    return NextResponse.json({ points }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
