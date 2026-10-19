"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput, PASSWORD_RULE_TEXT } from "@/lib/validation/auth";
import { registerAction } from "@/lib/actions/auth";
import { TextField } from "./ui/TextField";
import { Button } from "./ui/Button";
import { Notice } from "./ui/Notice";

export function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      department: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setFormError(null);
    const result = await registerAction(data);
    if (result.ok === false) {
      if (result.formError) setFormError(result.formError);
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof RegisterInput, { message });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {formError && <Notice tone="warning">{formError}</Notice>}

      <TextField label="Full name" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
      <TextField
        label="Work email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField label="Department" error={errors.department?.message} {...register("department")} />
      <TextField
        label="Phone / WhatsApp"
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        hint={PASSWORD_RULE_TEXT}
        error={errors.password?.message}
        {...register("password")}
      />
      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
