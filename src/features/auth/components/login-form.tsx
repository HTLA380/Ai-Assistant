"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@mijn-ui/react";
import { Button } from "@mijn-ui/react-button";
import { Input } from "@mijn-ui/react-input";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { login } from "../actions";
import { LoginFormValues, loginFormSchema } from "../types";

const LoginForm = () => {
  const [loading, startTransition] = useTransition();

  const defaultValues = {
    username: "emilys",
    password: "emilyspass",
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormValues) => {
    startTransition(async () => {
      const result = await login(data);
      if (result?.error) {
        toast.error(result.error || "Something Went Wrong.");
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <Button
            disabled={loading}
            variant="primary"
            className="w-full"
            type="submit">
            {loading ? "Signing In..." : "Login"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export { LoginForm };
