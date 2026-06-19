import { z } from "zod";

export const loginSchema = z.object({
  subdomain: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9-]*$/,
      "Subdomain can only contain lowercase letters, numbers, and dashes",
    )
    .optional(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
