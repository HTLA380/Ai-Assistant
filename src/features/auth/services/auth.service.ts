import api from "@/lib/axios";
import { ApiResponse } from "@/app/api/types";
import { User } from "../types";

export const getProfile = async (): Promise<User | null> => {
  try {
    const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
    return response.data.data?.user || null;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
};

export const login = async (credentials: any): Promise<User> => {
  const response = await api.post<ApiResponse<{ user: User }>>(
    "/auth/login",
    credentials
  );
  if (response.data.data?.user) {
    return response.data.data.user;
  }
  throw new Error("Login failed: User data not found.");
};

export const register = async (credentials: any): Promise<User> => {
  const response = await api.post<ApiResponse<{ user: User }>>(
    "/auth/register",
    credentials
  );
  if (response.data.data?.user) {
    return response.data.data.user;
  }
  throw new Error("Registration failed: User data not found.");
};
