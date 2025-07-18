import { Response, Request, NextFunction } from "express";
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

    if (!usuario || usuario.role !== "admin") {
      return res.status(403).json({
        error: "Acesso negado: usuário não tem papel de administrador",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export default verificarAdmin;
