import React from "react";
import { Metadata } from "next";
import NotesClient from "./Notes.client"; // Перевірте шлях до вашого клієнтського файлу

interface Props {
  params: Promise<{ slug: string[] }>;
}

// Асинхронна генерація метаданих для сторінки фільтрації
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug && slug.length > 0 ? slug[slug.length - 1] : "all";

  // Робимо першу літеру великою для красивого відображення в Title
  const formattedTag = currentTag.charAt(0).toUpperCase() + currentTag.slice(1);
  const title = `Notes filtered by ${formattedTag} | NoteHub`;
  const description = `View and search notes filtered by category or tag: ${currentTag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/${slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub Filter - ${formattedTag}`,
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: Props) {
  const { slug } = await params;
  const currentTag = slug && slug.length > 0 ? slug[slug.length - 1] : "all";

  return <NotesClient tag={currentTag} />;
}
