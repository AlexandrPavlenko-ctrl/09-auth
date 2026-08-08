import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const backendResponse = await fetch(
      "https://notehub-api.goit.study/auth/session",
      {
        method: "GET",
        headers: { Cookie: cookieHeader },
      },
    );

    if (backendResponse.status === 200) {
      const text = await backendResponse.text();
      if (!text) {
        return new NextResponse("", { status: 200 }); // Пустая строка по ТЗ, если неавторизован
      }
      const userData = JSON.parse(text);
      return NextResponse.json(userData, { status: 200 });
    }

    return new NextResponse("", { status: 200 });
  } catch (error) {
    console.error("Proxy session error:", error);
    return new NextResponse("", { status: 200 });
  }
}
