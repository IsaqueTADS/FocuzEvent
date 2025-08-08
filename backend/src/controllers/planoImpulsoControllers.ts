import { Request, Response } from "express";
import prisma from "src/utils/prisma";

export default async function buscarPlanoImpulso(req: Request, res: Response) {
  try {
    const impulso = await prisma.impulso.findFirst({
      select: {
        id: true,
        valor: true,
      },
    });

    if (!impulso) {
      res.status(404).json({ error: "Plano de impulso não encontrado." });
      return;
    }

    res.status(200).json(impulso);
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
