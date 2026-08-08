import axios from "axios";

// Используем чистый относительный путь. Браузер сам подставит текущий хост (localhost или Vercel)
const baseURL = "/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Включает работу с cookies сессий
});

// Добавляем экспорт старого имени для совместимости со всеми вашими файлами ДЗ
export const nextServer = api;
export default api;
