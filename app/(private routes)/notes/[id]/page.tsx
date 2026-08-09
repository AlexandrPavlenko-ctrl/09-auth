import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { fetchNoteById } from "@/lib/api/serverApi"; // Используем серверную функцию API
import { NoteDetailsClient } from "./NoteDetails.client"; // Ваша клиентская страница/компонент
import type { Metadata } from "next";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Асинхронная генерация метаданых страницы
 */
export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await fetchNoteById(id);
    return {
      title: note?.title || "Note Details",
    };
  } catch {
    return {
      title: "Note Not Found",
    };
  }
}

/**
 * Серверный компонент страницы с пред-загрузкой (Hydration SSR)
 */
export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  // 1. Создаем QueryClient на стороне сервера
  const queryClient = new QueryClient();

  try {
    // 2. Предварительно загружаем данные в кэш React Query на сервере
    await queryClient.prefetchQuery({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
    });
  } catch {
    // Если нотатка удалена, не существует или бэкенд упал — отдаем 404
    notFound();
  }

  return (
    // 3. Передаем дегидрированное состояние кэша через HydrationBoundary
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* ИСПРАВЛЕНО: Убран проп id={id}, вызывавший ошибку типов.
          Клиентский компонент сам возьмет id из строки URL через useParams */}
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
