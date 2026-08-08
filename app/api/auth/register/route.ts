import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, string>;

    const backendResponse = await fetch(
      "https://notehub-api.goit.study/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!backendResponse.ok) {
      const errorData = (await backendResponse.json()) as Record<
        string,
        unknown
      >;
      return NextResponse.json(
        { message: errorData.message || "Registration failed" },
        { status: backendResponse.status },
      );
    }

    const userData = await backendResponse.json();
    const response = NextResponse.json(userData, { status: 201 });

    const setCookieHeaders = backendResponse.headers.getSetCookie();
    if (setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie) => {
        response.headers.append("set-cookie", cookie);
      });
    }

    return response;
  } catch (error) {
    console.error("Proxy register error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
