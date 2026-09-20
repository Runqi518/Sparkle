import { NextResponse } from "next/server";
import { CanvasSnapshotSchema } from "../../../../../../schemas/project";
import { getProject, saveCanvas } from "@/lib/projects";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  return NextResponse.json({ canvas: project.canvas, updatedAt: project.updatedAt });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = CanvasSnapshotSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { id } = await params;
  const project = await saveCanvas(id, parsed.data);
  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  return NextResponse.json({ project });
}
