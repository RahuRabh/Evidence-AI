import { api } from "./client";
import type { AuthResponse } from "../types/auth";

export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type OtpPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

export async function registerRequest(payload: AuthPayload) {
  const response = await api.post<AuthResponse>("/auth/register", payload, {
    headers: { _skipRefresh: true },
  });
  return response.data;
}

export async function loginRequest(payload: AuthPayload) {
  const response = await api.post<AuthResponse>("/auth/login", payload, {
    headers: { _skipRefresh: true },
  });
  return response.data;
}

export async function refreshRequest() {
  const response = await api.post<AuthResponse>("/auth/refresh");
  return response.data;
}

export async function sendOtpRequest(email: string) {
  const response = await api.post("/auth/forgot-Password", { email });
  return response.data;
}

export async function verifyOtpRequest(payload: OtpPayload) {
  const response = await api.post("/auth/verify-Otp", payload);
  return response.data;
}

export async function logoutRequest() {
  const response = await api.post<{ message: string }>("/auth/logout");
  return response.data;
}

export async function googleAuth(idToken: string) {
  const response = await api.post<AuthResponse>(
    "/auth/google",
    {},
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
        _skipRefresh: true,
      },
      withCredentials: true,
    },
  );
  return response.data;
}

export async function updatePasswordRequest(payload: UpdatePasswordPayload) {
  const response = await api.put("/user/update-Password", payload);
  return response.data;
}
