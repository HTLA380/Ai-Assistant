"use server"

import { redirect } from "next/navigation"
import { deleteCookie, setCookie } from "@/utils/cookies/server"
import { ACCESS_TOKEN, REFRESH_TOKEN, User } from "@/lib/auth"
import axiosServer from "@/lib/axios"
import { LoginFormValues, RegisterFormValues } from "../schema"

export type AuthResponse = {
  user: User
  accessToken: string
  refreshToken: string
}

export async function login(values: LoginFormValues) {
  try {
    const response = await axiosServer.post<AuthResponse>("/auth/login", {
      ...values,
    })

    const { accessToken, refreshToken } = response.data as AuthResponse

    await setCookie(ACCESS_TOKEN, accessToken)
    await setCookie(REFRESH_TOKEN, refreshToken)
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Invalid credentials.",
    }
  }

  redirect("/chat")
}

export async function register(values: RegisterFormValues) {
  try {
    const response = await axiosServer.post<AuthResponse>("/auth/signin", {
      ...values,
    })

    const { accessToken, refreshToken } = response.data as AuthResponse

    await setCookie(ACCESS_TOKEN, accessToken)
    await setCookie(REFRESH_TOKEN, refreshToken)
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Invalid credentials.",
    }
  }

  redirect("/chat")
}

export async function logout() {
  await deleteCookie(ACCESS_TOKEN)
  await deleteCookie(REFRESH_TOKEN)
  redirect("/login")
}
