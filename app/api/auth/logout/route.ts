import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const backendResponse = await fetch(
      "https://notehub-api.goit.study/auth/logout",
      {
        method: "POST",
        headers: { Cookie: cookieHeader },
      },
    );

    const response = NextResponse.json({ success: true }, { status: 200 });

    // При логауте принудительно затираем куку в браузере клиента
    response.headers.set(
      "set-cookie",
      "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
    );

    return response;
  } catch (error) {
    console.error("Proxy logout error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
