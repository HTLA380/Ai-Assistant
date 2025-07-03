import { User } from "@/features/auth/types";
import api from "@/lib/axios.server";

export const getProfile = async (): Promise<User | null> => {
  try {
    const response = await api.get<{ data: User }>("/auth/me");
    return response.data.data;
  } catch (_) {
    return null;
  }
};
