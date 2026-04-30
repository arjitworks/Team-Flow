import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().max(1000).optional(),
});

export const addMemberSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
});
