import { Request, Response } from "express";
import prisma from "src/utils/prisma";
import { AuthRequest } from "src/utils/type";
import z from "zod";

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

export async function atualizarimpulso(req: Request, res: Response) {
  try {
    const impulsoIdSchema = z.object({
      impulsoId: z.string(),
    });

    const { impulsoId } = impulsoIdSchema.parse(req.params);

    const impulso = await prisma.impulso.findUnique({
      where: {
        id: impulsoId,
      },
    });

    if (!impulso) return res.status(404).json("Impulso não econtrado.");

    res.status(200).json(impulso);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Dados inválidos" });
    }
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
