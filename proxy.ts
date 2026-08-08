import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Масиви приватних та публічних маршрутів строго за вашим ТЗ
const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Зчитуємо токен сесії з cookies браузера користувача на серверній стороні
  const sessionToken = request.cookies.get("session")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 1. ЗАХИСТ ПРИВАТНИХ МАРШРУТІВ: Якщо куки немає, а юзер намагається відкрити /profile або /notes
  if (isPrivateRoute && !sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // 2. ЗАХИСТ ПУБЛИЧНИХ МАРШРУТІВ: Якщо кука ЕСТЬ, але авторизований юзер відкриває сторінку входу
  if (isPublicRoute && sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile"; // Примусово виштовхуємо залогіненого юзера в особистий кабінет
    return NextResponse.redirect(url);
  }

  // Якщо умови перенаправлення не справдилися, дозволяємо запит далі
  return NextResponse.next();
}

// Конфігурація матчера: вказуємо, для яких маршрутів має запускатися цей файл
export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
