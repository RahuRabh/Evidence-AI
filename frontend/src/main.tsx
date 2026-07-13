import React from "react";
import { Toaster } from "sonner";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from "./app/App";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import { ChatProvider } from "./features/chat/context/ChatProvider";
import { SettingsProvider } from "./features/settings/context/SettingsProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <ChatProvider>
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <App />
                <Toaster richColors position="top-right" />
              </GoogleOAuthProvider>
            </ChatProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
