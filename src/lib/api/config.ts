// In dev, use proxy (same-origin) to avoid CORS. In prod, use explicit URLs.
const isDev = import.meta.env.DEV;

// Normalize the base URL by removing trailing slashes
// Default to the EC2 endpoint when no env var is provided
const rawUrl = import.meta.env.VITE_RAG_API_URL || "http://98.89.232.245:8000";
export const RAG_API_BASE_URL = rawUrl.replace(/\/+$/, "");

// Funds Pipeline API (funds-pipeline backend)
const rawFundsUrl = import.meta.env.VITE_FUNDS_API_URL || "http://localhost:8000";
export const FUNDS_API_BASE_URL = rawFundsUrl.replace(/\/+$/, "");

// Funds Agent API (LangChain agent with MCP tools)
// Dev: proxy to avoid CORS. Prod: explicit URL (e.g. from env).
const rawFundsAgentUrl = isDev
  ? "/api/funds-agent"
  : (import.meta.env.VITE_FUNDS_AGENT_URL || "http://localhost:8001");
export const FUNDS_AGENT_API_URL = rawFundsAgentUrl.replace(/\/+$/, "");

// Conversation Service (used by funds-agent for persistence)
const rawConvUrl = isDev
  ? "/api/conversation-service"
  : (import.meta.env.VITE_CONVERSATION_SERVICE_URL || "http://localhost:8002");
export const CONVERSATION_SERVICE_URL = rawConvUrl.replace(/\/+$/, "");
