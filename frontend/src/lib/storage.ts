const ACCESS_TOKEN_KEY = "task-manager-access-token";
const USER_KEY = "task-manager-user";
import { user as User } from "../types/auth"

export function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearStoredAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const user = localStorage.getItem(USER_KEY);

  if (!user || user === "undefined") {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    localStorage.removeItem(USER_KEY);
    
    return null;
  }
}

export function setStoredUser(user: User) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}
