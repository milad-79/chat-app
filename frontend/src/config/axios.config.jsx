import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

console.log(BASE_URL);

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
