import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, string>;

    const backendResponse = await fetch("https://notehub-api.goit.study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

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
    const setCookieHeader = backendResponse.headers.get("set-cookie");
    const response = NextResponse.json(userData, { status: 201 });

    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
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
