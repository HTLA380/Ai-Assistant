import { api } from "@/lib/api";
import { User } from "../types";

/**
 * Fetches the current user's profile from the server.
 * This function is authenticated and uses `fetchWithAuth`.
 */
export const getMe = async (): Promise<User | null> => {
  try {
    const user = await api.get<User>("/auth/me");

    return user || null;
  } catch (error) {
    console.warn("Failed to fetch user profile:", error);
    return null;
  }
};
