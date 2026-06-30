import { z } from "zod";

export const loginFormSchema = z.object({
  userIdentifier: z.string().min(1, "User identifier is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
