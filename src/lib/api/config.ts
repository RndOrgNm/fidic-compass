// Normalize the base URL by removing trailing slashes
// Default to the EC2 endpoint when no env var is provided
const rawUrl = import.meta.env.VITE_RAG_API_URL || "http://98.89.232.245:8000";
export const RAG_API_BASE_URL = rawUrl.replace(/\/+$/, "");

