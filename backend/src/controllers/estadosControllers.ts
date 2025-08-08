import { Request, Response } from "express";
import prisma from "src/utils/prisma";

export default async function buscarTodosEstados(req: Request, res: Response) {
  try {
    const estados = await prisma.estado.findMany({
      select: {
        id: true,
        nome: true,
      },
    });
    res.status(200).json(estados);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}
