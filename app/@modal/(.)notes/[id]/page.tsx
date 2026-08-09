import React from "react";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import NotePreviewClient from "./NotePreview.client";
import { fetchNoteById } from "@/lib/api/serverApi"; // ВИПРАВЛЕНО: Імпорт строго із serverApi за вимогою ментора

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePreviewModalPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // Попередньо завантажуємо дані в кеш React Query на серверній стороні
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* ПЕРЕДАЄМО id: Оскільки ваш клієнтський компонент його очікує, 
          тепер типізація зійдеться ідеально */}
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
