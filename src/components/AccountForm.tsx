"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAccountSchema, type UpdateAccountInput } from "@/lib/validation/auth";
import { updateAccountAction } from "@/lib/actions/account";
import { TextField } from "./ui/TextField";
import { Button } from "./ui/Button";
import { Notice } from "./ui/Notice";

export function AccountForm({
  initial,
}: {
  initial: { fullName: string; department: string; phone: string };
}) {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateAccountInput>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: initial,
  });

  const onSubmit = async (data: UpdateAccountInput) => {
    setSaved(false);
    const result = await updateAccountAction(data);
    if (result.ok) {
      setSaved(true);
    } else if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof UpdateAccountInput, { message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} method="post" className="flex flex-col gap-5" noValidate>
      {saved && <Notice tone="success">Your details have been updated.</Notice>}

      <TextField label="Full name" error={errors.fullName?.message} {...register("fullName")} />
      <TextField label="Department" error={errors.department?.message} {...register("department")} />
      <TextField label="Phone / WhatsApp" type="tel" error={errors.phone?.message} {...register("phone")} />

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
