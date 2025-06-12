import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { get, post } from "@/lib/api.js";
import { toast } from "react-hot-toast";

const fetchAuthUser = async () => {
    const res = await get("/auth/me"); // safe now due to guard
    return res?.user;
};

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: authUser, isLoading, isError } = useQuery({
        queryKey: ["authUser"],
        queryFn: fetchAuthUser,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const login = async (credentials, endpoint = "/auth/login") => {
        const { user } = await post(endpoint, credentials);
        if (user) {
            localStorage.setItem("authUser", JSON.stringify(user));
            queryClient.setQueryData(["authUser"], user);
            toast.success("Logged in successfully");
            navigate("/");
        }
    };

    const logout = async () => {
        await post("/auth/logout");
        localStorage.removeItem("authUser");
        queryClient.clear();
        queryClient.setQueryData(["authUser"], null);
        toast.success("Logout successful");
        navigate("/login");
    };

    return {
        authUser,
        isAuthenticated: !!authUser,
        isLoading,
        isError,
        login,
        logout,
    };
};