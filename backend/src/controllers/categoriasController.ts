import { Request, Response } from "express";
import prisma from "src/utils/prisma";

export async function buscarCategorias(req: Request, res: Response) {
  try {
    const categorias = await prisma.categoriaEvento.findMany({
      select: {
        id: true,
        titulo: true,
      },
    });

    if (categorias.length === 0) {
      return res.status(404).json({ error: "Nenhuma categoria econtrada" });
    }
    res.status(200).json(categorias);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}
