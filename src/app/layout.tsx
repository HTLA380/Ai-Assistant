import { AuthStoreProvider } from "@/features/auth/stores/auth-store-provider";
import { Inter } from "next/font/google";
import "./globals.css";
import { getProfile } from "@/features/auth/services/auth.service";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Pico Ai Assitant",
  description: "",
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
