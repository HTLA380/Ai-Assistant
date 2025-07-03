import { User } from "@/features/auth/types";
import api from "@/lib/axios.server";
import { NextResponse } from "next/server";
import { ApiResponse } from "../../types";

export async function GET(): Promise<
  NextResponse<ApiResponse<{ user: User }>>
> {
  try {
    const response = await api.get("/auth/me");

    return NextResponse.json({ data: { user: response.data } });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          message: error.response?.data?.message || "An error occurred",
        },
      },
      { status: error.response?.status || 500 }
    );
  }
}
