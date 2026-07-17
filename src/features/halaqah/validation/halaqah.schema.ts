import { z } from "zod";

export const halaqahSchema = z.object({
  name_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  id_muhafiz: z.coerce.number().min(1, "Pilih Muhafidz"),
});

export type HalaqahFormValues = z.infer<typeof halaqahSchema>;
