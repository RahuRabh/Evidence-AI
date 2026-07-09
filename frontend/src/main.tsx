import React from "react";
import { Toaster } from "sonner";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from "./app/App";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ChatProvider } from "./features/chat/ChatProvider";
import { WorkSpaceProvider } from "./features/workspace/WorkSpaceProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <WorkSpaceProvider>
            <ChatProvider>
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <App />
                <Toaster richColors position="top-right" />
              </GoogleOAuthProvider>
            </ChatProvider>
          </WorkSpaceProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
