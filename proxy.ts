import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. Если пользователь не авторизован и идет на страницы входа/регистрации — СРАЗУ пропускаем
  if (isAuthRoute && !accessToken) {
    return NextResponse.next();
  }

  // 2. Защита приватных маршрутов
  if (!accessToken && isPrivateRoute) {
    if (refreshToken) {
      try {
        const response = await checkSession();
        const setCookie = response.headers["set-cookie"];

        if (setCookie) {
          const cookieArray =
            Array.isArray(setCookie) ? setCookie : [setCookie];
          const nextResponse = NextResponse.next();

          for (const cookieStr of cookieArray) {
            const parsed = parseSetCookie(cookieStr);
            const options = {
              path: parsed.path,
              maxAge: parsed.maxAge,
              expires: parsed.expires,
              httpOnly: parsed.httpOnly,
              secure: parsed.secure,
              sameSite: parsed.sameSite as
                | "lax"
                | "strict"
                | "none"
                | undefined,
            };
            if (
              (parsed.name === "accessToken" ||
                parsed.name === "refreshToken") &&
              parsed.value
            ) {
              nextResponse.cookies.set(parsed.name, parsed.value, options);
            }
          }
          return nextResponse;
        }
      } catch {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 3. ИСПРАВЛЕНО: Защита от бесконечного мигания.
  // Если accessToken ЕСТЬ, и пользователь пытается зайти на страницы входа,
  // создаем редирект с принудительным сбросом кэша маршрутизатора Next.js
  if (isAuthRoute && accessToken) {
    const res = NextResponse.redirect(new URL("/", request.url));
    res.headers.set("x-middleware-cache", "no-cache");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
