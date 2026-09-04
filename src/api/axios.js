import axios from "axios";

const api = axios.create({
  baseURL:"http://72.62.228.103:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const session = JSON.parse(
      localStorage.getItem("staffSession")
    );

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("staffSession");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;