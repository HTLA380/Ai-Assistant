import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ACCESS_TOKEN, fetchWithAuth, REFRESH_TOKEN } from "../fetch-with-auth";
import * as cookieUtils from "../cookies";
import { AsyncLocalStorage } from "async_hooks";

type User = "userA" | "userB";
const userContext = new AsyncLocalStorage<User>();

let fetchMock: ReturnType<typeof vi.fn>;

const tokenMap = {
  userA: {
    access_token: "access-token-user-a-expired",
    refresh_token: "refresh-token-user-a",
    new_access_token: "new-access-token-user-a",
  },
  userB: {
    access_token: "access-token-user-b-expired",
    refresh_token: "refresh-token-user-b",
    new_access_token: "new-access-token-user-b",
  },
};

// State to track tokens for each user during the test
let tokenState: {
  [key in User]: { accessToken: string };
};

// State to track calls
let refreshCallCount: { [key in User]: number };

describe("fetchWithAuth - Multi-user Concurrent Requests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    // Reset states
    tokenState = {
      userA: { accessToken: tokenMap.userA.access_token },
      userB: { accessToken: tokenMap.userB.access_token },
    };
    refreshCallCount = { userA: 0, userB: 0 };

    // Mock cookies to be user-aware using AsyncLocalStorage
    vi.spyOn(cookieUtils, "getCookie").mockImplementation(async (key) => {
      const user = userContext.getStore();
      if (!user) return undefined;

      if (key === ACCESS_TOKEN) {
        return tokenState[user].accessToken;
      }
      if (key === REFRESH_TOKEN) {
        return tokenMap[user].refresh_token;
      }
      return undefined;
    });

    vi.spyOn(cookieUtils, "setCookie").mockImplementation(
      async (key, value) => {
        const user = userContext.getStore();
        if (user && key === ACCESS_TOKEN) {
          tokenState[user].accessToken = value;
        }
      }
    );

    vi.spyOn(cookieUtils, "deleteCookie").mockResolvedValue();

    // Mock fetch to be user-aware
    fetchMock.mockImplementation(
      async (url: RequestInfo, options?: RequestInit) => {
        const user = userContext.getStore();
        if (!user) {
          throw new Error("fetch mock called without user context");
        }

        // Refresh endpoint
        if (url.toString().includes("/auth/refresh")) {
          refreshCallCount[user]++;
          // Simulate the new token being available for subsequent getCookie calls
          tokenState[user].accessToken = tokenMap[user].new_access_token;

          return new Response(
            JSON.stringify({ access_token: tokenMap[user].new_access_token }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Protected API endpoint
        const authHeader = (options?.headers as any)?.Authorization ?? "";
        const requestToken = authHeader.split(" ")[1];

        if (requestToken === tokenMap[user].access_token) {
          return new Response("Unauthorized", { status: 401 });
        }

        if (requestToken === tokenMap[user].new_access_token) {
          return new Response(JSON.stringify({ data: `${user}-data` }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(
          `Unexpected token: ${requestToken} for user ${user}`,
          { status: 500 }
        );
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("handles multiple users with concurrent requests correctly, refreshing token only once per user", async () => {
    const userRequests = (user: User, count: number) => {
      const promises = Array.from({ length: count }, (_, i) =>
        userContext.run(user, () =>
          fetchWithAuth(`https://api.example.com/${user}/data${i}`)
        )
      );
      return Promise.all(promises);
    };

    const [userAResponses, userBResponses] = await Promise.all([
      userRequests("userA", 3),
      userRequests("userB", 2),
    ]);

    // Assertions
    expect(userAResponses).toHaveLength(3);
    for (const res of userAResponses) {
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ data: "userA-data" });
    }

    expect(userBResponses).toHaveLength(2);
    for (const res of userBResponses) {
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ data: "userB-data" });
    }

    expect(refreshCallCount.userA).toBe(1);
    expect(refreshCallCount.userB).toBe(1);
  });
});
