import { NextResponse } from "next/server";
import { GenerationRequestSchema } from "../../../../../schemas/task";
import { createGenerationTask, getUserPoints } from "@/lib/generation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Zod 参数校验
    const parsed = GenerationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const task = await createGenerationTask(parsed.data);
    const remainingPoints = await getUserPoints();
    
    return NextResponse.json({ task, remainingPoints }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
