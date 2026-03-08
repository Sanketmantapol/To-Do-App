import prisma from "@/lib/db/prisma";
import { getSignedInUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import TodoForm from "./_components/TodoForm";
import TodoList from "./_components/TodoList";
import LogoutButton from "./_components/LogoutButton";

export default async function TodosPage() {
  let user;
  
  try {
    user = await getSignedInUser();
  } catch {
    redirect("/login");
  }

  const todos = await prisma.todo.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Todos</h1>
            <p className="text-gray-400 text-sm">
              Welcome {user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        <TodoForm />
        <TodoList todos={todos} />

      </div>
    </div>
  );
}

