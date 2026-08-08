"use client";

import React from "react";
import Link from "next/link"; // Повертаємо Link для активації Intercepting Routes
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "../../types/note";
import { deleteNote as deleteNoteApi } from "@/lib/api/clientApi";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteNote } = useMutation({
    mutationFn: deleteNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => {
        const noteTitle = note.title || "Untitled";
        const noteContent = note.content || "No content provided";

        return (
          <li key={note.id} className={css.listItem}>
            <h3 className={css.title}>{noteTitle}</h3>
            <p className={css.content}>{noteContent}</p>

            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>

              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                {/* ВИПРАВЛЕНО: Чисте посилання на ID без параметрів ?page= чи ?search= */}
                <Link
                  href={`/notes/${note.id}`}
                  prefetch={false}
                  scroll={false} // Запобігає стрибкам сторінки вгору
                  className={css.link}
                  style={{
                    alignSelf: "auto",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  View Details
                </Link>

                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  className={css.button}
                  style={{ alignSelf: "auto" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default NoteList;
