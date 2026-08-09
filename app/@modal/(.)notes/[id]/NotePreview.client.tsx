"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import dynamic from "next/dynamic";

const Modal = dynamic(
  () => import("@/components/Modal/Modal").then((mod) => mod.Modal),
  { ssr: false },
);

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={handleClose}>
      <div style={{ padding: "10px" }}>
        {isError && (
          <div
            className="error"
            style={{ color: "#dc3545", textAlign: "center" }}
          >
            <h2>⚠️ Помилка завантаження</h2>
            <p>
              {(error as Error).message ||
                "Не вдалося отримати дані з сервера."}
            </p>
          </div>
        )}

        {isLoading && (
          <div
            className="loading"
            style={{ textAlign: "center", color: "#6c757d" }}
          >
            Завантаження деталей нотатки...
          </div>
        )}

        {!isLoading && !isError && !note && (
          <div style={{ textAlign: "center", color: "#7f8c8d" }}>
            Нотатку не знайдено
          </div>
        )}

        {!isLoading && !isError && note && (
          <article>
            <h2 style={{ color: "#2c3e50", marginBottom: "12px" }}>
              {note.title || "Без заголовка"}
            </h2>
            <p
              style={{
                whiteSpace: "pre-wrap",
                color: "#333",
                lineHeight: "1.6",
              }}
            >
              {note.content}
            </p>
            {note.tag && (
              <div style={{ marginTop: "16px" }}>
                <span
                  style={{
                    backgroundColor: "#e9ecef",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    color: "#495057",
                  }}
                >
                  #{note.tag}
                </span>
              </div>
            )}
          </article>
        )}
      </div>
    </Modal>
  );
}
