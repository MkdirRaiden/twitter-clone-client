// api.js
import axios from "axios";
import { toast } from "react-toastify";
import { queryClient } from "@/main";

// Axios instance
const api = axios.create({
    baseURL: import.meta.env.PROD
        ? "https://twitter-clone-backend-f6w8.onrender.com/api"
        : "/api",
    withCredentials: true,
});

// Check if user is authenticated
const isLoggedIn = () => !!queryClient.getQueryData(["authUser"]);

const handleResponse = (res) => {
    const payload = res?.data?.data;
    if (!payload || payload.status !== true) {
        throw new Error("Unexpected response format or failure");
    }
    if (payload.message) toast.success(payload.message);
    return payload;
};

const handleError = (error, suppressToast = false) => {
    const statusCode = error?.response?.status;
    const msg =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";

    const isUnauthorized = statusCode === 401;

    if (!suppressToast && !isUnauthorized) {
        toast.error(msg);
    }

    throw new Error(msg);
};

export const get = async (url, options = {}) => {
    if (!isLoggedIn()) return null;
    try {
        const res = await api.get(url);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

export const post = async (url, data = {}, options = {}) => {
    if (!isLoggedIn() && !url.includes("/auth")) return null;
    try {
        const res = await api.post(url, data);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

export const patch = async (url, data = {}, options = {}) => {
    if (!isLoggedIn()) return null;
    try {
        const res = await api.patch(url, data);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

export const put = async (url, data = {}, options = {}) => {
    if (!isLoggedIn()) return null;
    try {
        const res = await api.put(url, data);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

export const del = async (url, data = null, options = {}) => {
    if (!isLoggedIn()) return null;
    try {
        const res = data
            ? await api.delete(url, { data })
            : await api.delete(url);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

export default api;
