import { getCookie } from "./cookies";

export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";

const refreshMap = new Map<string, Promise<string>>();

export interface FetchWithAuthOptions extends RequestInit {
  skipAuth?: boolean;
  timeoutMs?: number;
}

/**
 * A wrapper around `fetch` that automatically handles access token injection and token refresh logic.
 * It's designed to be safe for concurrent requests from the same user.
 *
 * @param input The `RequestInfo` for the fetch call (URL or Request object).
 * @param options Custom options including `skipAuth` to bypass all auth logic.
 * @returns A `Promise` that resolves to the `Response` of the request.
 * @throws An error if authentication fails and cannot be recovered.
 */
export async function fetchWithAuth(
  input: RequestInfo,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { skipAuth, timeoutMs = 8000, ...init } = options;

  if (skipAuth) {
    return fetchWithTimeout(input, init, timeoutMs);
  }

  const refreshToken = await getCookie(REFRESH_TOKEN);

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  // First attempt
  const accessToken = await getCookie(ACCESS_TOKEN);

  const response = await makeAuthenticatedRequest(
    input,
    init,
    accessToken,
    timeoutMs
  );

  if (response.status !== 401) {
    return response;
  }

  // Handle token refresh
  try {
    if (!refreshMap.has(refreshToken)) {
      const refreshPromise = doRefreshToken().finally(() => {
        refreshMap.delete(refreshToken);
      });
      refreshMap.set(refreshToken, refreshPromise);
    }

    const newToken = await refreshMap.get(refreshToken);
    return makeAuthenticatedRequest(input, init, newToken, timeoutMs);
  } catch (error: any) {
    console.error("Token refresh failed. Logging out.", {
      errorMessage: error.message,
    });
    await logout();

    throw new Error(`Authentication failed: ${error.message}`);
  }
}

/* -------------------------------------------------------------------------- */
/*                                  UTILITIES                                 */
/* -------------------------------------------------------------------------- */

async function makeAuthenticatedRequest(
  input: RequestInfo,
  init: RequestInit,
  token: string | undefined,
  timeoutMs: number
): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    ...init.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return fetchWithTimeout(
    input,
    {
      ...init,
      headers,
      credentials: "include",
    },
    timeoutMs
  );
}

async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function doRefreshToken(): Promise<string> {
  try {
    const refreshToken = await getCookie(REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error("No refresh token found in cookies for refresh attempt.");
    }
    // We must fetch to our own api to make this work as next.js only allows you to ONLY read
    // cookies in the server component and you can't set them.
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          // must pass the cookies manually also, because we are making
          // api request to our own server.
          Cookie: `${REFRESH_TOKEN}=${refreshToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Refresh request failed with status ${res.status}`);
    }

    const data = await res.json();

    const newAccessToken = data?.accessToken;

    if (!newAccessToken) {
      throw new Error("New access token not found in refresh response");
    }

    // The cookie is set by the API route. We just need to return the token for the current flow.
    return newAccessToken;
  } catch (err: any) {
    throw new Error(`Token refresh failed: ${err.message || "Unknown error"}`);
  }
}

async function logout() {
  try {
    const refreshToken = await getCookie(REFRESH_TOKEN);
    const accessToken = await getCookie(ACCESS_TOKEN);

    const headers = new Headers();
    if (refreshToken) {
      headers.append("Cookie", `${REFRESH_TOKEN}=${refreshToken}`);
    }
    if (accessToken) {
      headers.append("Cookie", `${ACCESS_TOKEN}=${accessToken}`);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`,
      {
        method: "POST",
        headers,
      }
    );
    if (!res.ok) {
      console.error(`Server logout failed with status: ${res.status}`);
    }
  } catch (err) {
    console.error("Failed to make logout request", err);
  }
}
