import * as cookieUtils from "@/lib/cookies";
import {
  ACCESS_TOKEN,
  fetchWithAuth,
  REFRESH_TOKEN,
} from "@/lib/fetch-with-auth";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let fetchMock: ReturnType<typeof vi.fn>;

describe("fetchWithAuth", () => {
  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    vi.spyOn(cookieUtils, "getCookie").mockImplementation(async (key) => {
      if (key === ACCESS_TOKEN) return "valid-access-token";
      if (key === REFRESH_TOKEN) return "valid-refresh-token";
      return undefined;
    });

    vi.spyOn(cookieUtils, "setCookie").mockResolvedValue();
    vi.spyOn(cookieUtils, "deleteCookie").mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("makes a request with a valid access token", async () => {
    fetchMock.mockResolvedValueOnce(new Response("Success", { status: 200 }));

    const res = await fetchWithAuth("https://api.example.com/data");

    expect(res.status).toBe(200);
    const fetchCall = fetchMock.mock.calls[0][1];
    expect((fetchCall?.headers as any)?.Authorization).toBe(
      "Bearer valid-access-token"
    );
  });

  it("refreshes token on 401 and retries request", async () => {
    fetchMock.mockImplementation(
      async (url: RequestInfo, options?: RequestInit) => {
        const urlString = url.toString();
        const authHeader = (options?.headers as any)?.Authorization ?? "";

        if (urlString.includes("/auth/refresh")) {
          return new Response(
            JSON.stringify({ access_token: "new-access-token" }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        if (authHeader === "Bearer valid-access-token") {
          return new Response("Unauthorized", { status: 401 });
        }

        if (authHeader === "Bearer new-access-token") {
          return new Response("Retried success", { status: 200 });
        }

        return new Response("Unexpected request", { status: 500 });
      }
    );

    const res = await fetchWithAuth("https://api.example.com/protected");
    const body = await res.text();

    expect(res.status).toBe(200);
    expect(body).toBe("Retried success");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("logs out when refresh token is invalid", async () => {
    fetchMock.mockImplementation(async (url: RequestInfo) => {
      const urlString = url.toString();
      if (urlString.includes("/api/auth/logout")) {
        return new Response("Logout successful", { status: 200 });
      }
      return new Response("Unauthorized", { status: 401 });
    });

    vi.spyOn(cookieUtils, "getCookie").mockImplementation(async (key) => {
      if (key === REFRESH_TOKEN) return "invalid-refresh-token";
      if (key === ACCESS_TOKEN) return "some-access-token";
      return undefined;
    });

    await expect(() =>
      fetchWithAuth("https://api.example.com/secure")
    ).rejects.toThrow(/Authentication failed/);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/logout"),
      expect.any(Object)
    );
  });

  it("skips auth when skipAuth is true", async () => {
    fetchMock.mockResolvedValueOnce(new Response("Public", { status: 200 }));

    const res = await fetchWithAuth("https://api.example.com/public", {
      skipAuth: true,
    });

    expect(res.status).toBe(200);
    const headers = fetchMock.mock.calls[0][1]?.headers || {};
    expect((headers as any).Authorization).toBeUndefined();
  });

  it("aborts if request takes too long", async () => {
    fetchMock.mockImplementation((_url, options) => {
      return new Promise((resolve, reject) => {
        const signal = options?.signal;
        if (signal?.aborted) {
          return reject(
            new DOMException("The operation was aborted", "AbortError")
          );
        }

        const timeout = setTimeout(() => {
          resolve(new Response("Should have aborted"));
        }, 200);

        signal?.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new DOMException("The operation was aborted", "AbortError"));
        });
      });
    });

    await expect(() =>
      fetchWithAuth("https://api.example.com/slow-request", { timeoutMs: 100 })
    ).rejects.toThrow(/The operation was aborted/);
  });
});
