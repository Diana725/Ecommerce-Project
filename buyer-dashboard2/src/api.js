// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://www.maizeai.me/api", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
