import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçersiz e-posta adresi / Invalid email address"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır / Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
