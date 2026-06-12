import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

const baseURL = process.env.EXPO_PUBLIC_OPENAI_API_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.baseURL) {
      return Promise.reject(new Error('API URL is not configured'));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message ?? error.response?.data?.error;

    let message = serverMessage ?? error.message ?? '请求失败';

    if (status === 400) {
      message = serverMessage ?? '请求参数错误';
    } else if (status === 401) {
      message = serverMessage ?? '未登录或登录已过期';
    } else if (status === 404) {
      message = serverMessage ?? '接口不存在';
    } else if (status === 500) {
      message = serverMessage ?? '服务器错误';
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时';
    } else if (!error.response) {
      message = '网络连接失败';
    }

    return Promise.reject(new Error(message));
  }
);

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.request<T>(config);
  return response.data;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return '请求失败';
}
