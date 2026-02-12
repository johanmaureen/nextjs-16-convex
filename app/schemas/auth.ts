import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least  3 charaters")
    .max(30, "Name must be smaller than  30 charaters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least  6 charaters")
    .max(30, "Password must be smaller than  30 charaters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least  6 charaters").max(30),
});
