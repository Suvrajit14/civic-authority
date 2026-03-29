// In production (Vercel), use the Railway backend URL
// In development, use relative /api (proxied by Vite to localhost:3000)
export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';
