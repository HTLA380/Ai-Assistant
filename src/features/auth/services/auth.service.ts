import api from "@/lib/axios";
import { User } from "../types";

export const getProfile = async (): Promise<User | null> => {
  try {
    const response = await api.get<{ data: User }>("/auth/me");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
};

export const login = async (credentials: any): Promise<User> => {
  const response = await api.post<{ user: User }>("/auth/login", credentials);
  return response.data.user;
};

export const register = async (credentials: any): Promise<User> => {
  const response = await api.post<{ user: User }>("/auth/register", credentials);
  return response.data.user;
};
