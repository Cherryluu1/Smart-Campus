import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("smartcampus_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("smartcampus_token");
            localStorage.removeItem("smartcampus_user");

            const publicPaths = ["/login", "/signin", "/sign-in", "/register", "/signup", "/sign-up"];
            const currentPath = window.location.pathname;

            if (!publicPaths.some((p) => currentPath.startsWith(p))) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;