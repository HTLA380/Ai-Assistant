import { deleteCookie, setCookie } from "@/lib/cookies";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/fetch-with-auth";
import { NextResponse } from "next/server";
import { ApiResponse } from "../../types";
import { cookies } from "next/headers";

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  console.info("Refresh Token", refreshToken);

  if (!refreshToken) {
    console.info("Refresh Token Not found, retruning an error", refreshToken);

    return NextResponse.json(
      { error: { message: "Refresh token not found." } } as ApiResponse,
      { status: 401 }
    );
  }

  try {
    const externalApiUrl = `${process.env.EXTERNAL_API_URL}/auth/refresh`;

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    console.log("Refresh Token Data Response Object:", response);

    const data = await response.json();

    console.log("Response from external API:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token.");
    }

    const newAccessToken = data.accessToken;

    await setCookie("access_token", newAccessToken);

    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
  } catch (error: any) {
    console.error("Refresh Error:", error);

    await deleteCookie(ACCESS_TOKEN);
    await deleteCookie(REFRESH_TOKEN);

    return NextResponse.json(
      {
        error: { message: error.message || "Failed to refresh token" },
      } as ApiResponse,
      { status: 401 }
    );
  }
}
