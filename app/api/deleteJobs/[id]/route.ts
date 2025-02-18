import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required." },
        { status: 400 }
      );
    }

    const deletedJob = await prisma.job.delete({
      where: { id: String(id) },
    });

    return NextResponse.json(deletedJob, { status: 200 });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the job." },
      { status: 500 }
    );
  }
}
