// Normalize the base URL by removing trailing slashes
const rawUrl = import.meta.env.VITE_RAG_API_URL || "http://localhost:8000";
export const RAG_API_BASE_URL = rawUrl.replace(/\/+$/, "");

