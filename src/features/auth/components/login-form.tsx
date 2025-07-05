"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mijn-ui/react-button";
import { Input } from "@mijn-ui/react-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Separator } from "@mijn-ui/react";
import { login } from "../actions";

const formSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters."),
  password: z.string().min(4).max(20),
});

type UserFormValue = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [loading, startTransition] = useTransition();

  const defaultValues = {
    username: "emilys",
    password: "emilyspass",
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
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
