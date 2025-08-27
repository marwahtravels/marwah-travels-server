// src/lib/http.ts
import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:7000",
  withCredentials: false, // token header use kar rahe
});

// Attach token from localStorage automatically
http.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Auto-logout on 401
http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // optional: redirect
      // window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);
