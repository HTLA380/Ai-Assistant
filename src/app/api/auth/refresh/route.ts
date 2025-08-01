import { NextResponse } from "next/server"
import { deleteCookie, getCookie, setCookie } from "@/utils/cookies/server"
import { ACCESS_TOKEN, REFRESH_TOKEN, refresh } from "@/lib/auth"
import { ApiResponse } from "../../types"

export async function POST(): Promise<NextResponse<ApiResponse>> {
  const refreshToken = await getCookie(REFRESH_TOKEN)

  if (!refreshToken) {
    return NextResponse.json({ error: { message: "Refresh token not found." } }, { status: 401 })
  }

  try {
    const newAccessToken = await refresh(refreshToken)

    await setCookie(ACCESS_TOKEN, newAccessToken)

    return NextResponse.json({ data: { message: "Token refreshed" } }, { status: 200 })
  } catch (error: any) {
    console.error("Refresh Error:", error)

    await deleteCookie(ACCESS_TOKEN)
    await deleteCookie(REFRESH_TOKEN)

    return NextResponse.json({ error: { message: error.message || "Failed to refresh token" } }, { status: 401 })
  }
}
