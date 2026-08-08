import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return "/api";
  }

  const configuredOrigin =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://127.0.0.1:3000";

  return new URL("/api", configuredOrigin).toString();
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Включает работу с cookies сессий
});

// Добавляем экспорт старого имени для совместимости со всеми вашими файлами ДЗ
export const nextServer = api;
export default api;
