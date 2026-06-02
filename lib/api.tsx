import axios from "axios";

const BACKEND_URL =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : process.env.NEXT_PUBLIC_BACKEND_URL || "https://portfolio-backend-1-f6e0.onrender.com/api";

export const API_URLS = {
  base: `${BACKEND_URL}/api`,
  auth: `${BACKEND_URL}/api/auth`,
  projects: `${BACKEND_URL}/api/projects`,
  analytics: `${BACKEND_URL}/api/analytics`,
  settings: `${BACKEND_URL}/api/settings`,
  preview: `${BACKEND_URL}/api/view`,
};

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  },
);

export default BACKEND_URL;
