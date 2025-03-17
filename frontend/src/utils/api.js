import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in all requests
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

// Add a response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log("[API Response]", {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      dataPreview: response.data ? "Data received" : "No data",
    });
    return response;
  },
  (error) => {
    console.error("[API Response Error]", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data,
    });

    // If we get a 401 or 403 error, log additional information
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn(
        "[Auth Error]",
        "Authentication failed, token may be invalid or expired"
      );

      // Don't automatically redirect or clear token here, just log the issue
      console.log("[Current Path]", window.location.pathname);
    }

    return Promise.reject(error);
  }
);

export default api;
