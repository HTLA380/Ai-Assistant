import { deleteCookie } from "@/lib/cookies";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/fetch-with-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiResponse } from "../../types";

export async function POST(): Promise<NextResponse<ApiResponse>> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;

  if (refreshToken) {
    try {
      const externalApiUrl = `${process.env.EXTERNAL_API_URL}/auth/logout`;
      await fetch(externalApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
      });
    } catch (error) {
      console.error("Failed to logout from external API:", error);
    }
  }

  await deleteCookie(ACCESS_TOKEN);
  await deleteCookie(REFRESH_TOKEN);

  return NextResponse.json(
    { data: { message: "Logout successful" } },
    { status: 200 }
  );
}
