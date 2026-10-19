"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordInput, PASSWORD_RULE_TEXT } from "@/lib/validation/auth";
import { changePasswordAction } from "@/lib/actions/auth";
import { TextField } from "./ui/TextField";
import { Button } from "./ui/Button";
import { Notice } from "./ui/Notice";

export function ChangePasswordForm() {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setSaved(false);
    const result = await changePasswordAction(data);
    if (result.ok) {
      setSaved(true);
      reset();
    } else if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof ChangePasswordInput, { message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} method="post" className="flex flex-col gap-5" noValidate>
      {saved && (
        <Notice tone="success">
          Your password has been changed. You&apos;ve been signed out everywhere else.
        </Notice>
      )}

      <TextField
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <TextField
        label="New password"
        type="password"
        autoComplete="new-password"
        hint={PASSWORD_RULE_TEXT}
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <TextField
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmNewPassword?.message}
        {...register("confirmNewPassword")}
      />

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Updating…" : "Change password"}
      </Button>
    </form>
  );
}
