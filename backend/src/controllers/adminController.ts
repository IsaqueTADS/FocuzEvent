import { Request, Response } from "express";
import prisma from "src/utils/prisma";
import { AuthRequest } from "src/utils/type";

export async function buscarAdmin(req: Request, res: Response) {
  const { usuarioId } = req as AuthRequest;

  try {
    const usuarioAdmin = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nome: true,
        role: true,
        email: true,
        foto_url: true,
        criado_em: true,
        atualizado_em: true,
      },
    });
    res.status(200).json(usuarioAdmin);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
