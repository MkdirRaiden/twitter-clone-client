import axios from "axios";
import { toast } from "react-toastify";
import { queryClient } from "@/main";

// Axios instance — baseURL and cookie setup
const api = axios.create({
    baseURL: import.meta.env.PROD
        ? "https://twitter-clone-backend-f6w8.onrender.com/api"
        : "http://localhost:8000/api", // or whatever your backend dev port is
    withCredentials: true, // sends cookies (JWT) on every request
});

// Handle success responses
const handleResponse = (res) => {
    const payload = res?.data?.data;
    if (!payload || payload.status !== true) {
        throw new Error("Unexpected response format or failure");
    }
    if (payload.message) toast.success(payload.message);
    return payload;
};

// Handle API errors globally
const handleError = (error, suppressToast = false) => {
    const statusCode = error?.response?.status;
    const msg =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";

    // Auto-logout for 401s (unauthorized)
    if (statusCode === 401 || statusCode === 403) {
        queryClient.setQueryData(["authUser"], null);
    }

    if (!suppressToast && statusCode !== 401) {
        toast.error(msg);
    }

    throw new Error(msg);
};

// GET
export const get = async (url, options = {}) => {
    try {
        const res = await api.get(url);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

// POST
export const post = async (url, data = {}, options = {}) => {
    try {
        const res = await api.post(url, data);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

// PATCH
export const patch = async (url, data = {}, options = {}) => {
    try {
        const res = await api.patch(url, data);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

// PUT
export const put = async (url, data = {}, options = {}) => {
    try {
        const res = await api.put(url, data);
        return handleResponse(res);
    } catch (err) {
        handleError(err, options.suppressToast);
    }
};

// DELETE
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
