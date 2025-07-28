// src/lib/types.ts (or src/types/llm.ts)

/**
 * Represents the structure of the LLM endpoint information.
 * Note: `key` is expected to be null here for security.
 */
// export interface LlmEndpointInfo {
//   key: null;
//   endpoint: string | Request | URL;
// }

/**
 * Represents the structure of the Tools configuration.
 */
export interface LlmToolsConfig {
  type: string;
  server_label: string;
  server_url: string;
  require_approval: string;
}

/**
 * Represents the full response structure from /api/llm-config.
 */
export interface LlmConfigResponse {
  endpoint: string | Request | URL;
  provider: string;
  model: string;
  token: null; // Or `string | null`
  smart_prompt: string;
  tools: LlmToolsConfig;
}

// Optional: Type for the data you send TO /api/chat
export interface ChatRequestPayload {
  messages: Array<{ role: string; content: string }>;
  llmConfig: LlmConfigResponse; // You'll pass the full config here
}

// Optional: Type for the data you get FROM /api/chat
export interface ChatResponsePayload {
  content: string;
}