"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "../stores/auth-store-provider";
import { useRouter } from "next/navigation";

const USER_EMAIL = "john@mail.com";
const USER_PASSWORD = "changeme";

interface AuthFormProps {
  isRegister?: boolean;
}

const formConfig = {
  login: {
    title: "Sign In",
    buttonText: "Sign In",
    linkText: "Don't have an account?",
    linkHref: "/register",
    linkActionText: "Sign Up",
  },
  register: {
    title: "Create an Account",
    buttonText: "Sign Up",
    linkText: "Already have an account?",
    linkHref: "/login",
    linkActionText: "Sign In",
  },
};

export const AuthForm = ({ isRegister = false }: AuthFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(USER_EMAIL);
  const [password, setPassword] = useState(USER_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const { login, register, isLoading, isAuthenticated } = useAuthStore(
    (state) => state
  );
  const router = useRouter();

  const config = isRegister ? formConfig.register : formConfig.login;

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          {config.title}
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
              {isLoading ? "Processing..." : config.buttonText}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {config.linkText}{" "}
          <Link
            href={config.linkHref}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            {config.linkActionText}
          </Link>
        </p>
      </div>
    </div>
  );
};
