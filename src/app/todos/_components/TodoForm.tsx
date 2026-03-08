"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    setLoading(false);
    router.refresh();
  };


  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      {" "}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new todo..."
        disabled={loading}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />{" "}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {" "}
        {loading ? "Adding..." : "Add"}{" "}
      </button>{" "}
    </form>
  );
}
