"use client";

import { useAuthStore } from "@/features/auth/stores/auth-store-provider";
import { useEffect } from "react";

const DashboardPage = () => {
  const { user, isLoading, getMe } = useAuthStore((state) => state);

  useEffect(() => {
    if (!user) {
      getMe();
    }
  }, [user, getMe]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h1 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || `https://avatar.vercel.sh/${user.email}`}
              alt="User Avatar"
              className="h-20 w-20 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {user.name}
              </h2>
              <p className="text-md text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
              User Details
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">User ID:</span> {user.id}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Role:</span> {user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
