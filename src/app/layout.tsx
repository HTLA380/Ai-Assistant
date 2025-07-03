import { getProfile } from "@/features/auth/services/auth.server.service";
import { AuthStoreProvider } from "@/features/auth/stores/auth-store-provider";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Manual Authentication",
  description:
    "A custom token-based authentication system built from scratch with Axios interceptors.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getProfile();

  const initialState = {
    user,
    isAuthenticated: !!user,
    isLoading: false,
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthStoreProvider initialState={initialState}>
          {children}
        </AuthStoreProvider>
      </body>
    </html>
  );
}
