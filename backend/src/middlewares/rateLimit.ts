import rateLimit from "express-rate-limit";

export const avatarLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  message: { error: "Espere 15 minutos antes de tentar novamente" },
  standardHeaders: true,
  legacyHeaders: false,
});
