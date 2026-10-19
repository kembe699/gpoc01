"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { loginAction } from "@/lib/actions/auth";
import { TextField } from "./ui/TextField";
import { Button } from "./ui/Button";
import { Notice } from "./ui/Notice";

export function LoginForm({ next }: { next?: string }) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginInput) => {
    setFormError(null);
    const result = await loginAction(data, next);
    if (result.ok === false) {
      if (result.formError) setFormError(result.formError);
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof LoginInput, { message });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} method="post" className="flex flex-col gap-5" noValidate>
      {formError && <Notice tone="warning">{formError}</Notice>}

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <label className="flex items-center gap-2 text-sm text-[var(--color-navy)]">
        <input
          type="checkbox"
          {...register("rememberMe")}
          className="h-4 w-4 rounded-[4px] border-[var(--color-border)] text-[var(--color-teal)] focus:ring-[var(--color-teal)]"
        />
        Remember me for 30 days
      </label>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
