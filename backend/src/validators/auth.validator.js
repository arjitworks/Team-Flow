import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(6).max(100),
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});
