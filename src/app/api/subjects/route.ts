import { NextResponse } from "next/server";
import { Subject, syncDatabase } from "@/lib/db";

// GET /api/subjects - 营销标的列表
export async function GET() {
  await syncDatabase();
  const subjects = await Subject.findAll({
    where: { status: 'active' },
    order: [['createdAt', 'DESC']],
  });
  return NextResponse.json({ subjects });
}

// POST /api/subjects - 创建营销标的
export async function POST(request: Request) {
  await syncDatabase();
  const body = await request.json();
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "标的名称不能为空" }, { status: 400 });
  }
  const subject = await Subject.create({
    name: body.name.trim(),
    type: body.type || 'product',
    brief: body.brief || '',
    sellingPoints: Array.isArray(body.sellingPoints) ? body.sellingPoints : [],
    targetAudience: body.targetAudience || '',
    brandKit: body.brandKit || null,
    referenceAssets: Array.isArray(body.referenceAssets) ? body.referenceAssets : [],
  });
  return NextResponse.json({ subject }, { status: 201 });
}
