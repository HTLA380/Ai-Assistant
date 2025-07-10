import { RegisterForm } from "@/features/auth/components/register-form";
import { Card } from "@mijn-ui/react";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <Card className="flex aspect-video w-full max-w-md flex-col items-center justify-center p-4">
      <RegisterForm />
      <div className="mt-4">
        <p className="text-sm">
          Already have an account?{" "}
          <Link href={"/login"} className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default RegisterPage;
