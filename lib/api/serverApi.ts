import { cookies } from "next/headers";
import { api } from "./api"; // Если в проекте инстанс экспортируется как nextServer, замените на: import { nextServer as api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note"; // Импортируем интерфейс Note из ваших модулей
import type { AxiosResponse } from "axios";

/**
 * Серверна функція перевірки сесії для proxy.ts
 * ІСПРАВЛЕНО: Використовує Axios та повертає ПОВНИЙ об'єкт відповіді AxiosResponse, як вимагає ТЗ
 */
export async function checkSession(): Promise<AxiosResponse<User>> {
  const cookieStore = await cookies();
  const rawCookies = cookieStore.toString();

  // Робимо запит через ваш екземпляр Axios.
  // Передаємо зчитані з утиліти cookies() значення в заголовок Cookie.
  const response = await api.get<User>("/auth/session", {
    headers: {
      Cookie: rawCookies,
    },
  });

  // Повертаємо чистий повний об'єкт AxiosResponse (містить status, headers, data тощо)
  return response;
}

/**
 * Отримання поточного профілю користувача
 */
export async function getMe(): Promise<User> {
  try {
    const cookieStore = await cookies();
    const rawCookies = cookieStore.toString();

    const { data } = await api.get<User>("/users/me", {
      headers: {
        Cookie: rawCookies,
      },
    });

    return data;
  } catch {
    // Зрозуміла обробка помилок із змістовним повідомленням при неавторизованому доступі
    throw new Error("Unauthorized access to user profile. Please log in.");
  }
}

/**
 * Отримання нотатки за її ідентифікатором
 * ІСПРАВЛЕНО: Тип any повністю замінено на інтерфейс Note
 */
export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const rawCookies = cookieStore.toString();

  // Повертає нотатку безпосередньо з даних відповіді
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: rawCookies,
    },
  });

  return data;
}

// ДОБАВЛЕНО ДЛЯ СОВМЕСТИМОСТИ: экспортируем функцию под обоими именами,
// чтобы proxy.ts вашего коллеги не упал, если он ищет checkServerSession
export { checkSession as checkServerSession };
