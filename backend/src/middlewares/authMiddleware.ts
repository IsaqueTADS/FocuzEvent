import "dotenv/config";

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "src/utils/type";
import { env } from "src/env/index";

const autenticacao = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  try {
    const decodificado = jwt.verify(token, env.JWT_SECRET);
    if (typeof decodificado === "object" && "usuarioId" in decodificado) {
      
      (req as AuthRequest).usuarioId = decodificado.usuarioId;
      next();
    } else {
      return res.status(401).json({ error: "Token inválido" });
    }
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

export default autenticacao;
