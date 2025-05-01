import axios, { AxiosRequestConfig } from 'axios';
import { getToken, removeToken } from '../store/authStore';

const BASE_URL = "http://localhost:3300";
const DEFAULT_TIMEOUT = 30000;

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'content-type': 'application/json',
    },
    withCredentials: true,
    ...config,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = token;
      } else if (config.headers && 'Authorization' in config.headers) {
        delete config.headers.Authorization;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    }, (error) => {
      if (error.response.status === 401) {
        removeToken();
        window.location.href = '/login';
        return;
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();

// 공통 요청 부분

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

export const requestHandler = async <T>(method: RequestMethod, url: string, payload?: T) => {
  let response;

  switch (method) {
    case 'post':
      response = await httpClient.post(url, payload);
      break;
    case 'get':
      response = await httpClient.get(url);
      break;
    case 'put':
      response = await httpClient.put(url, payload);
      break;
    case 'delete':
      response = await httpClient.delete(url);
      break;
  }

  return response.data;
}