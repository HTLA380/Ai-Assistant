"use server";

import api from "@/lib/axios.server";
import { z } from "zod";
import { AuthResponse } from "./types";
import { setCookie } from "@/lib/cookes";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid username or password. " };
  }

  try {
    const { username, password } = validatedFields.data;

    const response = await api.post<AuthResponse>("/auth/login", {
      username,
      password,
    });

    const { accessToken, refreshToken } = response.data as AuthResponse;

    setCookie("auth_token", accessToken);
    setCookie("refresh_token", refreshToken);
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Invalid credentials.",
    };
  }

  redirect("/dashboard");
}

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export async function register(values: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  // 2. Mock API Call: Since dummyjson has no register endpoint, we simulate success.
  // When we have a real backend, we'll replace this block with a real API call.
  console.log("Simulating registration for:", validatedFields.data.email);

  const mockAccessToken = "mock-access-token-for-" + validatedFields.data.email;
  const mockRefreshToken =
    "mock-refresh-token-for-" + validatedFields.data.email;

  setCookie("auth_token", mockAccessToken);
  setCookie("refresh_token", mockRefreshToken);

  redirect("/dashboard");
}
