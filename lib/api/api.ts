import axios from "axios";

const getBaseURL = () => {
  // 1. В браузере бьем по относительному пути (сработает rewrites в next.config)
  if (typeof window !== "undefined") {
    return "/api";
  }

  // 2. На сервере Vercel бьем НАПРЯМУЮ по адресу бэкенда GoIT
  return "https://notehub-api.goit.study";
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Включает работу с cookies сессий везде
});

// Автоматически прокидываем куки сессии при серверном рендеринге (SSR) на Vercel
api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const rawCookies = cookieStore.toString();

      if (rawCookies && config.headers) {
        config.headers.Cookie = rawCookies;
      }
    } catch {
      // ИСПРАВЛЕНО: Переменная 'e' удалена, чтобы линтер не ругался при сборке
    }
  }
  return config;
});

export const nextServer = api;
export default api;
