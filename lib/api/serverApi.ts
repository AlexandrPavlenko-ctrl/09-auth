import { cookies } from "next/headers";
import { api } from "./api";
import type { Note, FetchNotesParams } from "@/types/note";
import type { User } from "@/types/user";

const getServerConfig = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  return {
    headers: {
      Cookie: cookieHeader,
    },
  };
};

export async function fetchNotes(params: FetchNotesParams): Promise<Note[]> {
  const config = await getServerConfig();
  const { data } = await api.get<Note[]>("/notes", { ...config, params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const config = await getServerConfig();
  const { data } = await api.get<Note>(`/notes/${id}`, config);
  return data;
}

export async function checkSession(): Promise<User | null> {
  const config = await getServerConfig();
  try {
    const { data } = await api.get<User | "">("/auth/session", config);
    if (data === "") return null;
    return data;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User> {
  const config = await getServerConfig();

  try {
    const { data } = await api.get<User>("/users/me", config);
    return data;
  } catch (error) {
    if (typeof error === "object" && error !== null && "response" in error) {
      const response = (error as { response?: { status?: number } }).response;
      if (response?.status === 401) {
        throw new Error("Unauthorized");
      }
    }
    throw error;
  }
}
