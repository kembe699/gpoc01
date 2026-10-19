import { z } from "zod";
import { config } from "../config";

// At least 8 characters, with at least one letter and one number — shown
// under the password field on the register form too, so keep this comment
// in sync if the rule ever changes.
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
export const PASSWORD_RULE_TEXT = "At least 8 characters, with at least one letter and one number.";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .toLowerCase()
  .refine((email) => {
    if (!config.allowedEmailDomain) return true;
    return email.endsWith(`@${config.allowedEmailDomain}`);
  }, `Only @${config.allowedEmailDomain ?? ""} email addresses can register`);

const passwordSchema = z
  .string()
  .min(8, PASSWORD_RULE_TEXT)
  .regex(PASSWORD_RULE, PASSWORD_RULE_TEXT);

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name"),
    email: emailSchema,
    department: z.string().trim().min(1, "Department is required"),
    phone: z.string().trim().min(6, "Enter a valid phone number"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address").toLowerCase(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const updateAccountSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  department: z.string().trim().min(1, "Department is required"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
