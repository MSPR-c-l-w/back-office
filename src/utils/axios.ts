import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "./tokenStorage";

const REFRESH_ENDPOINT = "/auth/refresh";
const LOGIN_PATH = "/auth/login";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Type de la config passée à l'interceptor request (aligné sur les types axios) */
type RequestInterceptorConfig = Parameters<
  Parameters<typeof api.interceptors.request.use>[0]
>[0];

api.interceptors.request.use((config: RequestInterceptorConfig) => {
  const isRefresh = config.url?.includes(REFRESH_ENDPOINT);
  if (!isRefresh) {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach((prom) => (error != null ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
}

function redirectToLogin() {
  if (typeof window !== "undefined" && window.location.pathname !== LOGIN_PATH) {
    window.location.href = LOGIN_PATH;
  }
}

type RetryableConfig = { url?: string; _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: { response?: { status?: number }; config?: RetryableConfig }) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest.url?.includes(REFRESH_ENDPOINT);
    if (isRefreshRequest) {
      processQueue(error);
      redirectToLogin();
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest as Parameters<typeof api>[0]))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        processQueue(error);
        redirectToLogin();
        return Promise.reject(error);
      }
      const { data } = await api.post<{ access_token: string; refresh_token: string }>(
        REFRESH_ENDPOINT,
        { refresh_token: refreshToken }
      );
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      processQueue(null);
      return api(originalRequest as Parameters<typeof api>[0]);
    } catch (refreshError) {
      clearTokens();
      processQueue(refreshError);
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;