export type user = {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
};

export type AuthResponse = {
  token: string;
  message?: string;
  user: user;
};
