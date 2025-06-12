import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { get, post } from "@/lib/api.js";

const fetchAuthUser = async () => {
    const res = await get("/auth/me", { suppressToast: true });
    return res.user; // backend should return { status: true, user: {...} }
};

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    //  Fetch logged-in user reactively
    const { data: authUser, isLoading, isError } = useQuery({
        queryKey: ["authUser"],
        queryFn: fetchAuthUser,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    // Login and Signup handler
    const login = async (credentials, endpoint = "/auth/login") => {
        const { user } = await post(endpoint, credentials);
        if (user) {
            localStorage.setItem("authUser", JSON.stringify(user)); // optional
            queryClient.setQueryData(["authUser"], user);
            navigate(`/`);
        }
    };

    // Logout
    const logout = async () => {
        await post("/auth/logout");

        localStorage.removeItem("authUser");

        // Clear authUser from cache properly
        queryClient.setQueryData(["authUser"], null);

        // Optionally force a refetch to ensure App updates
        queryClient.invalidateQueries(["authUser"]);

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
