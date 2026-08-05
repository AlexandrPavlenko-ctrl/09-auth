import React from "react";
import { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm"; // Перевірте точність шляху до вашої форми
import css from "./CreateNote.module.css"; // Перевірте назву вашого CSS-модуля

// Експорт об'єкта metadata згідно з ТЗ та зауваженнями ментора
export const metadata: Metadata = {
  title: "Create New Note | NoteHub",
  description:
    "Page for creating a new note and managing its content and tags inside NoteHub application.",
  openGraph: {
    title: "Create New Note | NoteHub",
    description:
      "Page for creating a new note and managing its content and tags inside NoteHub application.",
    // FIX: Встановлено канонічну повну URL-адресу сторінки створення нотатки
    url: "https://notehub.com/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Create Note Page Preview",
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
