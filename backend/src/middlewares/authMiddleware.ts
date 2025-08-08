import "dotenv/config";

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "src/env/index";
import prisma from "src/utils/prisma";
import { AuthRequest } from "src/utils/type";

const autenticacao = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  try {
    const decodificado = jwt.verify(token, env.JWT_SECRET);
    if (typeof decodificado === "object" && "usuarioId" in decodificado) {
      const { usuarioId } = decodificado;

      (req as AuthRequest).usuarioId = usuarioId;

      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
      });

      if (!usuario) {
        res.status(404).json({ error: "Usuario não encontrado" });
        return;
      }

      if (usuario.ativo === false) {
        res.status(404).json({ error: "Usuario não encontrado" });
        return;
      }
      next();
    } else {
      res.status(401).json({ error: "Token inválido" });
      return;
    }
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

export default autenticacao;
