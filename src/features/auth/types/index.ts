export type User = {
  id: string;
  username: string;
  email: string;
  gender: string;
  image: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
