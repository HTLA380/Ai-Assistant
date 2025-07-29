import { cookies } from "next/headers"
import axiosServer from "./axios"

export type User = {
  id: string
  username: string
  email: string
  gender: string
  image: string
  role: string
}

export const ACCESS_TOKEN = "access-token"
export const REFRESH_TOKEN = "refresh-token"

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value

  if (!accessToken) {
    return null
  }

  try {
    const { data: user } = await axiosServer.get<User>("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return user || null
  } catch (_) {
    // It's better to return null and let the caller handle the error
    // than to throw here, as it might be an expected "not logged in" state.
    return null
  }
}

export async function validateToken(accessToken?: string) {
  if (!accessToken) {
    return Promise.reject(new Error("Access token is required."))
  }

  const response = await fetch(`${process.env.EXTERNAL_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorData.message || "Failed to fetch user")
  }

  return response.json()
}

export async function refresh(refreshToken: string): Promise<string> {
  const response = await fetch(`${process.env.EXTERNAL_API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorData.message || "Failed to refresh token")
  }

  const data = await response.json()
  const newAccessToken = data.accessToken

  if (!newAccessToken) {
    throw new Error("New access token not found in refresh response.")
  }

  return newAccessToken
}
