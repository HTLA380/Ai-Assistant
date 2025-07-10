import { fetchWithAuth } from "./fetch-with-auth";

export interface RequestOptions<B = unknown> extends Omit<RequestInit, "body"> {
  skipAuth?: boolean;
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: B;
}

const BASE_URL = process.env.EXTERNAL_API_URL || "";

/**
 * Build a full URL with query parameters.
 */
function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const url = new URL(path, BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Unified request handler with generic response typing and improved error handling.
 * @template T - Expected response type
 * @template B - Request body type
 */
async function request<T = unknown, B = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  options: RequestOptions<B> = {}
): Promise<T> {
  const {
    skipAuth = false,
    timeoutMs,
    params,
    body,
    headers,
    ...rest
  } = options;

  const url = buildUrl(path, params);

  const init: RequestInit = {
    method,
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  };

  let response: Response;
  try {
    response = await fetchWithAuth(url, { ...init, timeoutMs, skipAuth });
  } catch (err) {
    throw new Error(`Network error: ${(err as Error).message}`);
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return response.json();
}

// Exported API helpers
export const api = {
  get: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T, unknown>("GET", path, options),

  post: <T = unknown, B = unknown>(
    path: string,
    data?: B,
    options?: RequestOptions<B>
  ) => request<T, B>("POST", path, { ...options, body: data }),

  put: <T = unknown, B = unknown>(
    path: string,
    data?: B,
    options?: RequestOptions<B>
  ) => request<T, B>("PUT", path, { ...options, body: data }),

  delete: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T, unknown>("DELETE", path, options),
};
