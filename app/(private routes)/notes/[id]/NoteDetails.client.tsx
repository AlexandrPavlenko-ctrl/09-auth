"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi"; // На клиенте вызываем КЛИЕНТСКИЙ апи

export function NoteDetailsClient() {
  // Автоматически достаем id из параметров строки URL
  const params = useParams<{ id: string }>();
  const id = params.id;

  // Хук подхватит данные из HydrationBoundary сервера, так как queryKey СОВПАДАЕТ
  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{note?.title}</h1>
      <p>{note?.content}</p>
    </div>
  );
}
