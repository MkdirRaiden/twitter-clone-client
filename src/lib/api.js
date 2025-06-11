import axios from "axios";
import toast from "react-hot-toast";

// Create the axios instance
const api = axios.create({
    baseURL: import.meta.env.PROD
        ? "https://twitter-clone-backend-f6w8.onrender.com/api"
        : "/api", // for local dev (proxied by Vite)
    withCredentials: true,
});

// Standard response handler
const handleResponse = (res) => {
    const payload = res?.data?.data;

    if (!payload || payload.status !== true) {
        throw new Error("Unexpected response format or failure");
    }

    if (payload.message) toast.success(payload.message);
    return payload;
};

// 🔧 Updated: Support toast suppression
const handleError = (error, suppressToast = false) => {
    const msg =
        error?.response?.data?.data?.message || // your backend's message
        error?.response?.data?.message ||       // fallback
        error?.message ||
        "Something went wrong!";

    if (!suppressToast) toast.error(msg);
    throw new Error(msg);
};

// 🔧 Updated: Accept options for suppressToast

export const get = async (url, options = {}) => {
    try {
        const res = await api.get(url);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

export const post = async (url, data = {}, options = {}) => {
    try {
        const res = await api.post(url, data);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

export const patch = async (url, data = {}, options = {}) => {
    try {
        const res = await api.patch(url, data);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

export const put = async (url, data = {}, options = {}) => {
    try {
        const res = await api.put(url, data);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

export const del = async (url, data = null, options = {}) => {
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
