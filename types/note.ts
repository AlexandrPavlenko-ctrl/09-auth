// Головний інтерфейс об'єкта нотатки з нового бекенду GoIT
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// ВИПРАВЛЕНО: Додано обов'язковий експорт параметрів для fetch-запитів
export interface FetchNotesParams {
  page: number;
  limit?: number;
  search?: string;
  tag?: string;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Додатковий тип для тегів (якщо ви використовуєте суворий тип замість рядка string)
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
