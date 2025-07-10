import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ACCESS_TOKEN, fetchWithAuth, REFRESH_TOKEN } from "../fetch-with-auth";
import * as cookieUtils from "../cookies";

let fetchMock: ReturnType<typeof vi.fn>;
let refreshCallCount = 0;

describe("fetchWithAuth - Stress test (50 concurrent requests)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    refreshCallCount = 0;

    fetchMock = vi.fn();
    global.fetch = fetchMock;

    mockCookies();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("handles 50 concurrent requests with a single refresh", async () => {
    setupFetchQueue();

    const requests = Array.from({ length: 50 }, (_, i) =>
      fetchWithAuth(`https://api.example.com/stress-${i}`)
    );

    const start = Date.now();
    const responses = await Promise.all(requests);
    const duration = Date.now() - start;

    expect(responses).toHaveLength(50);
    responses.forEach((res) => {
      expect(res.status).toBe(200);
    });

    expect(refreshCallCount).toBe(1);
    expect(duration).toBeLessThan(2000);

    console.log(
      `✅ 50 concurrent requests completed in ${duration}ms with ${refreshCallCount} refresh call`
    );
  });
});

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function mockCookies() {
  vi.spyOn(cookieUtils, "getCookie").mockImplementation(async (key) => {
    if (key === REFRESH_TOKEN) return "stress-refresh-token";
    if (key === ACCESS_TOKEN) return "expired-token";
    return undefined;
  });

  vi.spyOn(cookieUtils, "setCookie").mockResolvedValue();
  vi.spyOn(cookieUtils, "deleteCookie").mockResolvedValue();
}

function setupFetchQueue() {
  const responseQueue = [
    ...Array(50).fill(new Response("Unauthorized", { status: 401 })),
    new Response(JSON.stringify({ access_token: "new-access-token" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
    ...Array(50).fill(new Response('{"success": true}', { status: 200 })),
  ];

  fetchMock.mockImplementation((url) => {
    const res = responseQueue.shift();

    if (typeof url === "string" && url.includes("/auth/refresh")) {
      refreshCallCount++;
    }

    return Promise.resolve(res);
  });
}
