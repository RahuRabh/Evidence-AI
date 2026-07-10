import { api } from "./client";
import { AuthResponse } from "../types/auth";

export type UpdateProfilePayload = {
  name: string;
  imageFile?: File | null;
}

export async function updateProfileRequest(payload: UpdateProfilePayload) {
  const formData = new FormData();
  formData.append("name", payload.name);

  if (payload.imageFile) formData.append("image", payload.imageFile);

  const response = await api.put<AuthResponse>("/user/profile", formData);

  return response.data;
}
