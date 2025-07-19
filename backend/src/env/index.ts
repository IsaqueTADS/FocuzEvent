import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z
    .string()
    .min(10, "A chave JWT deve ter pelo menos 10 caracteres "),
  PORT: z.coerce.number().default(3000),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Variavéis de ambiente inválidas", z.treeifyError(_env.error));
  throw new Error("Variavéis de ambiente inválidas");
}

export const env = _env.data;
