"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput, PASSWORD_RULE_TEXT } from "@/lib/validation/auth";
import { resetPasswordAction } from "@/lib/actions/auth";
import { TextField } from "./ui/TextField";
import { Button } from "./ui/Button";
import { Notice } from "./ui/Notice";

export function ResetPasswordForm({ token }: { token: string }) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setFormError(null);
    const result = await resetPasswordAction(data);
    if (result.ok === false) {
      if (result.formError) setFormError(result.formError);
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ResetPasswordInput, { message });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} method="post" className="flex flex-col gap-5" noValidate>
      {formError && <Notice tone="warning">{formError}</Notice>}
      <input type="hidden" {...register("token")} />

      <TextField
        label="New password"
        type="password"
        autoComplete="new-password"
        hint={PASSWORD_RULE_TEXT}
        error={errors.password?.message}
        {...register("password")}
      />
      <TextField
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  );
}
