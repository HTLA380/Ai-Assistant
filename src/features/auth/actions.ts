"use server";

import { deleteCookie, setCookie } from "@/lib/cookies";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LoginFormValues, RegisterFormValues } from "./types";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/fetch-with-auth";

export async function login(values: LoginFormValues) {
  try {
    const response = await fetch(`${process.env.EXTERNAL_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    console.log(data);

    await setCookie(ACCESS_TOKEN, data.accessToken);
    await setCookie(REFRESH_TOKEN, data.refreshToken);
  } catch (error: any) {
    return {
      error: error.message || "Invalid credentials.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function register(values: RegisterFormValues) {
  try {
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();

    await setCookie(ACCESS_TOKEN, data.accessToken);
    await setCookie(REFRESH_TOKEN, data.refreshToken);
  } catch (error: any) {
    return {
      error: error.message || "Registration failed. Please try again.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  await deleteCookie(ACCESS_TOKEN);
  await deleteCookie(REFRESH_TOKEN);
  redirect("/login");
}
