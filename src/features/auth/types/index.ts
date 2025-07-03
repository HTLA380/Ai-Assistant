export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
