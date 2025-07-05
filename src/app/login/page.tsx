import { LoginForm } from "@/features/auth/components/login-form";
import { Card } from "@mijn-ui/react";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="absolute left-10 top-5 text-lg font-extrabold">PicoChat</p>
      <Card className="flex aspect-video w-full max-w-md flex-col items-center justify-center p-4">
        <LoginForm />
        <div className="mt-4">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href={"/register"} className="text-blue-500 underline">
              SignIn
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
