import { AuthResponse } from "@/features/auth/types";
import api from "@/lib/axios.server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiResponse } from "../../types";

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const { data } = await api.post<AuthResponse>("/auth/login", body);

    const { accessToken, refreshToken } = data;

    const cookieStore = await cookies();
    cookieStore.set("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json(
      { data: { message: "Login Successful" } },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          message: error.response?.data?.message || "An error occurred",
        },
      },
      { status: error.response?.status || 500 }
    );
  }
}
