import { getStoredToken } from "@/common/utils/authStorage";
import { ROUTER_PATH } from "@/routers/Route";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:8000/";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    
    return Promise.reject(error);
  },
);

export default axiosClient;
