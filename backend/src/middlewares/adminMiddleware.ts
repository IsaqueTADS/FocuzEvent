import { NextFunction, Request, Response } from "express";
import prisma from "src/utils/prisma";
import { AuthRequest } from "src/utils/type";

const verificarAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { usuarioId } = req as AuthRequest;

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!usuario || usuario.role !== "ADMIN") {
      res.status(403).json({
        error: "Acesso negado: usuário não tem papel de administrador",
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export default verificarAdmin;
