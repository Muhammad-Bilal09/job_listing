import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Get logged-in user session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id; // Get logged-in user's ID
    const { searchParams } = new URL(req.url);
    const job_id = searchParams.get("job_id");

    // Only filter by job_id if provided
    const whereCondition: any = { user_id: userId };
    if (job_id) whereCondition.job_id = job_id;

    // Fetch applications for the logged-in user
    const applications = await prisma.application.findMany({
      where: whereCondition,
      include: {
        job: true, // Include job details
      },
    });

    return NextResponse.json({ success: true, applications });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch applications";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
