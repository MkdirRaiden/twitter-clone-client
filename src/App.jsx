import { useQuery } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import SignUpPage from "@/pages/auth/signup/SignUpPage";
import LoginPage from "@/pages/auth/login/LoginPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import NotificationPage from "@/pages/notification/NotificationPage";
import FollowingPage from "@/pages/following/FollowingPage";
import PageNotFound from "@/pages/PageNotFound";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import AllSuggestedUsers from "@/pages/suggested/AllSuggestedUsers";
import { get } from "@/lib/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await get("/auth/me", { suppressToast: true });
      return res?.user ?? null;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <AuthenticatedLayout user={authUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/following" element={<FollowingPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/all-suggested-users" element={<AllSuggestedUsers />} />
        </Route>

        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUpPage />}
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
