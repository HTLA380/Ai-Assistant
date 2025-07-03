import { User } from "@/features/auth/types";
import api from "@/lib/axios.server";
import { ApiResponse } from "@/app/api/types";

export const getProfile = async (): Promise<User | null> => {
  try {
    const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
    return response.data.data?.user || null;
  } catch (_) {
    return null;
  }
};
