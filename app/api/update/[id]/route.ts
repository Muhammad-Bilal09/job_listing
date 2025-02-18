import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function PUT(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    const id = req.nextUrl.pathname.split("/").pop();

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(
      { message: "Todo updated successfully!", updatedTodo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo." },
      { status: 500 }
    );
  }
}
