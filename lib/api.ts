import axios from "axios";
import { Note } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
  },
});

export interface FetchNotesParams {
  search?: string;
  page?: number;
  limit?: number;
  tag?: string | string[];
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tag: string;
}

/**
 * Отримання нотаток — ВИПРАВЛЕНО (Тип відповіді суворо відповідає бекенду)
 */
export const fetchNotes = async (
  params?: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const cleanedParams: Record<string, string> = {};

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (key === "page" || key === "limit") return;
      if (key === "tag" && (value === "all" || value === "All")) return;

      if (value !== "" && value !== undefined && value !== null) {
        if (key === "tag" && Array.isArray(value)) {
          if (value.length > 0) {
            cleanedParams[key] = value.join(",");
          }
        } else {
          cleanedParams[key] = String(value);
        }
      }
    });
  }

  const response = await api.get<FetchNotesResponse>("/notes", {
    params: cleanedParams,
  });
  return response.data;
};

/**
 * Отримання деталей нотатки за її ID
 */
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

/**
 * Створення нотатки
 */
export const createNoteApi = async (noteData: CreateNoteDto): Promise<Note> => {
  const response = await api.post<Note>("/notes", noteData);
  return response.data;
};

/**
 * Видалення нотатки
 */
export const deleteNoteApi = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};
