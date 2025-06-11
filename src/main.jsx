import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";

// Bootstrap user from localStorage
const getInitialAuthUser = () => {
  const stored = localStorage.getItem("authUser");
  return stored ? JSON.parse(stored) : null;
};

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

//  Manually populate the cache after creating the client
const initialUser = getInitialAuthUser();
if (initialUser) {
  queryClient.setQueryData(["authUser"], initialUser);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
