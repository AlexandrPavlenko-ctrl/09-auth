import { api } from "./api";
import type { Note, FetchNotesParams, NotesResponse } from "@/types/note";
import type { User } from "@/types/user";

export interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}

export interface AuthCredentials {
  email: string;
  password?: string;
}

export interface UpdateUserData {
  username: string;
}

/**
 * Нотатки (Notes) — Клієнтські запити
 */
export async function fetchNotes(
  params: FetchNotesParams,
): Promise<NotesResponse> {
  const { data } = await api.get<NotesResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(noteData: NewNoteData): Promise<Note> {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

/**
 * Автентифікація (Auth) — Клієнтські запити
 */
export async function register(credentials: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>("/auth/register", credentials);
  return data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>("/auth/login", credentials);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<User | "">("/auth/session");
  if (data === "") return null;
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: UpdateUserData): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}
