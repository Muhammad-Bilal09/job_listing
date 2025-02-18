import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

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

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        category,
        location,
        salary: parseFloat(salary),
        posted_by,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Error adding job:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the job." },
      { status: 500 }
    );
  }
}
