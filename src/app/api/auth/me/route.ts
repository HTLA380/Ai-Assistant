import api from "@/lib/axios.server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await api.get("/auth/me");

    return NextResponse.json(response.data, { status: 200 });
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
