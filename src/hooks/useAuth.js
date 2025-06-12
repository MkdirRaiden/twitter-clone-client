import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { get, post } from "@/lib/api.js";

const fetchAuthUser = async () => {
    const res = await get("/auth/me", { suppressToast: true }); // guarded globally
    return res?.user;
};

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
            navigate("/");
        }
    };

    const logout = async () => {
        await post("/auth/logout");
        localStorage.removeItem("authUser");
        // Set user to null first to trigger rerenders
        queryClient.setQueryData(["authUser"], null);
        //  Now navigate
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
