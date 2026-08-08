import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { logErrorResponse } from "../../_utils/utils";
import { isAxiosError } from "axios";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const incomingCookies = request.headers.get("cookie") || "";
    const browserCookies = incomingCookies || cookieStore.toString();

    const res = await api.get("/users/me", {
      headers: {
        Cookie: browserCookies,
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("GET /users/me proxy error", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const incomingCookies = request.headers.get("cookie") || "";
    const browserCookies = incomingCookies || cookieStore.toString();
    const body = await request.json();

    const res = await api.patch("/users/me", body, {
      headers: {
        Cookie: browserCookies,
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("PATCH /users/me proxy error", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const incomingCookies = request.headers.get("cookie") || "";
    const browserCookies = incomingCookies || cookieStore.toString();
    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Avatar file is required" },
        { status: 400 },
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append("avatar", file, file.name);

    const res = await api.post("/users/me/avatar", uploadFormData, {
      headers: {
        Cookie: browserCookies,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("POST /users/me/avatar proxy error", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 },
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
