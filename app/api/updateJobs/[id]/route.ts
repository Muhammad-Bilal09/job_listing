import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();

    const { title, description, category, location, salary, posted_by } = body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !salary ||
      !posted_by
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const updatedJob = await prisma.job.update({
      where: { id: String(id) },
      data: {
        title,
        description,
        category,
        location,
        salary: parseFloat(salary),
        posted_by,
      },
    });

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the job." },
      { status: 500 }
    );
  }
}
