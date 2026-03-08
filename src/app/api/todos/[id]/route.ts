import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getSignedInUser } from "@/lib/auth/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const user = await getSignedInUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await prisma.todo.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  return NextResponse.json({ message: "Deleted successfully" });
}


export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const user = await getSignedInUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, completed, attachmentURL } = body;

  const result = await prisma.todo.updateMany({
    where: {
      id,
      userId: user.id,
    },
    data: {
      ...(title !== undefined && { title }),
      ...(completed !== undefined && { completed }),
      ...(attachmentURL !== undefined && { attachmentURL }), 
},
  });

  if (result.count === 0) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Updated successfully" });
}

