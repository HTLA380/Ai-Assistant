import z from "zod";

export type User = {
  id: string;
  username: string;
  email: string;
  gender: string;
  image: string;
  role: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export const loginFormSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters."),
  password: z.string().min(4).max(20),
});

export const registerFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
