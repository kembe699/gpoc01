"use server";

import { redirect } from "next/navigation";
import { prisma } from "../db";
import { getCurrentUser } from "../auth";
import { updateAccountSchema } from "../validation/auth";
import { type ActionResult, zodFieldErrors } from "./shared";

export async function updateAccountAction(input: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = updateAccountSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };

  await prisma.user.update({ where: { id: user.id }, data: parsed.data });
  return { ok: true };
}
