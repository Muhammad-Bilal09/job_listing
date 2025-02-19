import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const job_id = searchParams.get("job_id");
    const user_id = searchParams.get("user_id");

    const whereCondition: any = {};
    if (job_id) whereCondition.jobId = job_id;
    if (user_id) whereCondition.userId = user_id;

    const applications = await prisma.application.findMany({
      where: whereCondition,
      include: {
        job: true,
        user: true,
      },
    });

    return NextResponse.json({ success: true, applications });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch applications";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
