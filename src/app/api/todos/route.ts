import prisma from "@/lib/db/prisma";
import { getSignedInUser } from "@/lib/auth/server";
import { NextResponse } from "next/server";

// export async function GET() {
//   const user = await getSignedInUser();

//   if (!user) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const todos = await prisma.todo.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   });

//   return NextResponse.json(todos);
// }

export async function POST(req: Request) {
  const user = await getSignedInUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title } = body;

  if (!title) {
    return NextResponse.json(
      { message: "Title is required" },
      { status: 400 }
    );
  }

  const todo = await prisma.todo.create({
    data: {
      title,
      userId: user.id,
    },
  });

  return NextResponse.json(todo, { status: 201 });
}
