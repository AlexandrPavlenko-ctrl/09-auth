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

    const expiredCookies = [
      "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
      "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None",
      "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None",
    ];

    response.headers.append("set-cookie", expiredCookies[0]);
    response.headers.append("set-cookie", expiredCookies[1]);
    response.headers.append("set-cookie", expiredCookies[2]);

    return response;
  } catch (error) {
    console.error("Proxy logout error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
