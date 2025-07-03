import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiResponse } from "../../types";

export async function POST(): Promise<NextResponse<ApiResponse>> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: { message: "Refresh token not found." } },
      { status: 401 }
    );
  }

  try {
    // !TODO: Replace with your actual external API URL from .env
    const externalApiUrl = `${process.env.EXTERNAL_API_URL}/auth/refresh`;

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token.");
    }

    const newAuthToken = data.accessToken;

    cookieStore.set("auth_token", newAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return NextResponse.json(
      { data: { message: "Token refreshed" } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Refresh Error:", error);

    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json(
      { error: { message: error.message || "Failed to refresh token" } },
      { status: 401 }
    );
  }
}
