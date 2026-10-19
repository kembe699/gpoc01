"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth";
import { forgotPasswordAction } from "@/lib/actions/auth";
import { TextField } from "./ui/TextField";
import { Button } from "./ui/Button";
import { Notice } from "./ui/Notice";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  if (submitted) {
    return (
      <Notice tone="success">
        If an account exists for that email, we&apos;ve sent a reset link. It expires in 1 hour.
      </Notice>
    );
  }

  const onSubmit = async (data: ForgotPasswordInput) => {
    await forgotPasswordAction(data);
    // Always show the same confirmation, whether or not the account
    // exists — never reveal which emails are registered.
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
