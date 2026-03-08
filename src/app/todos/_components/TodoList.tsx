"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Paperclip } from "lucide-react";
import { useRef } from "react";
import config from "@/lib/config";
import Image from "next/image";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  attachmentURL?: string | null;
};

export default function TodoList({ todos }: { todos: Todo[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTodoId, setActiveTodoId] = useState<string | null>(null);
  const [attachmentUrls, setAttachmentUrls] = useState<Record<string, string>>(
    {},
  );

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase()),
  );

  const deleteTodo = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this todo?",
    );
    if (!confirmed) return;

    setDeletingId(id);
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    router.refresh();
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return;

    setSavingId(id);
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    });

    setSavingId(null);
    setEditingId(null);
    router.refresh();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeTodoId) return;

    setUploadingId(activeTodoId);

 
    const presignedResponse = await fetch("/api/s3/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        todoId: activeTodoId,
      }),
    });

    const { presignedUrl, key } = await presignedResponse.json();

  
    await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

   
    const attachmentURL = `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}/${process.env.NEXT_PUBLIC_MINIO_BUCKET_NAME}/${key}`;

    await fetch(`/api/todos/${activeTodoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attachmentURL }),
    });

    setUploadingId(null);
    setActiveTodoId(null);
    router.refresh();
  };

  const handleViewAttachment = async (attachmentURL: string) => {
    const key = attachmentURL.split(`${config.minio.bucketName}/`)[1];

    const res = await fetch("/api/s3/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    const { presignedUrl } = await res.json();
    window.open(presignedUrl, "_blank");
  };

  const loadAttachment = async (todoId: string, attachmentURL: string) => {
    const key = attachmentURL.split(`${config.minio.bucketName}/`)[1];

    const res = await fetch("/api/s3/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    const { presignedUrl } = await res.json();
    setAttachmentUrls((prev) => ({ ...prev, [todoId]: presignedUrl }));
  };

  const handleDeleteAttachment = async (
    todoId: string,
    attachmentURL: string,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this attachment?",
    );
    if (!confirmed) return;

    const key = attachmentURL.split(`${config.minio.bucketName}/`)[1];

    await fetch("/api/s3/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, todoId }),
    });

    setAttachmentUrls((prev) => {
      const updated = { ...prev };
      delete updated[todoId];
      return updated;
    });

    router.refresh();
  };

  return (
    <div
      className="space-y-4"
      style={{ cursor: deletingId || savingId ? "wait" : "default" }}
    >
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search todos..."
        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
      />

      <ul className="space-y-3">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="bg-gray-900 px-4 py-3 rounded-lg flex flex-col border border-gray-800"
          >
            <div className="flex justify-between items-center">
              {editingId === todo.id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-gray-800 text-white px-2 py-1 rounded flex-1 mr-3"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className={`cursor-pointer flex-1 ${
                    todo.completed ? "line-through text-gray-500" : "text-white"
                  }`}
                >
                  {todo.title}
                </span>
              )}

              
              <div className="flex gap-3 items-center">
                <button
                  type="button"
                  title={todo.attachmentURL ? "View attachment" : "Attach file"}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-yellow-400"
                  onClick={() => {
                    if (todo.attachmentURL) {
                      handleViewAttachment(todo.attachmentURL);
                    } else {
                      setActiveTodoId(todo.id);
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  {uploadingId === todo.id ? (
                    "Uploading..."
                  ) : (
                    <Paperclip size={18} />
                  )}
                </button>

                {editingId === todo.id ? (
                  <button
                    onClick={() => saveEdit(todo.id)}
                    disabled={savingId === todo.id}
                    className="text-green-500 hover:text-green-400"
                  >
                    {savingId === todo.id ? "Saving..." : "Save"}
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(todo)}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  {deletingId === todo.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
            {todo.attachmentURL && (
              <div className="mt-2">
                {attachmentUrls[todo.id] ? (
                  <div className="flex flex-col gap-2">
                    <Image
                      src={attachmentUrls[todo.id]}
                      alt="attachment"
                      width={300}
                      height={160}
                      className="rounded-lg object-cover cursor-pointer"
                      onClick={() => handleViewAttachment(todo.attachmentURL!)}
                    />
                    <button
                      onClick={() =>
                        handleDeleteAttachment(todo.id, todo.attachmentURL!)
                      }
                      className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-500 transition-colors w-fit"
                    >
                      Remove attachment
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => loadAttachment(todo.id, todo.attachmentURL!)}
                    className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-500 transition-colors w-fit"
                  >
                    Click to view attachment
                  </button>
                )}
              </div>
            )}
          </li>
        ))}

        {filteredTodos.length === 0 && (
          <p className="text-gray-500 text-center">No todos found.</p>
        )}
      </ul>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}

