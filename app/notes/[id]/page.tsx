import React from "react";
import { Metadata } from "next";
import { fetchNoteById } from "@/lib/api";
import { NoteDetailsClient } from "./NoteDetails.client"; // Перевірте шлях

interface Props {
  params: Promise<{ id: string }>;
}

// Асинхронна генерація метаданих на основі реальних даних нотатки з API
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    // Беремо перші 150 символів контенту для дескрипшену
    const shortDescription =
      note.content ?
        note.content.substring(0, 150) + "..."
      : "Детальний перегляд нотатки.";
    const title = `${note.title || "Untitled Note"} | NoteHub`;

    return {
      title,
      description: shortDescription,
      openGraph: {
        title,
        description: shortDescription,
        url: `https://notehub.com/${id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: note.title || "Note Details Preview",
          },
        ],
      },
    };
  } catch {
    // Безпечний фолбек, якщо нотатку не знайдено або API лежить
    return {
      title: "Note Details | NoteHub",
      description: "Detailed view of the note. Note not found or unavailable.",
    };
  }
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const initialNote = await fetchNoteById(id);

  // Ensure TypeScript recognizes the client component props
  // Use React.ReactElement to avoid "Cannot find namespace 'JSX'" TS error
  const NoteDetailsClientTyped = NoteDetailsClient as unknown as (props: {
    initialNote: unknown;
  }) => React.ReactElement;

  return <NoteDetailsClientTyped initialNote={initialNote} />;
}
