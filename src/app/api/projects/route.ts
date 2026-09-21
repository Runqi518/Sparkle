import { NextResponse } from "next/server";
import { CreateProjectSchema } from "../../../../schemas/project";
import { createProject, getProjects } from "@/lib/projects";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({ projects, limit: 10 });
}

export async function POST(request: Request) {
  const parsed = CreateProjectSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  try {
    const project = await createProject(parsed.data);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "无法创建项目" }, { status: 409 });
  }
}
