import prisma from "src/utils/prisma";
import z from "zod";

import { Request, Response } from "express";

export async function buscarTodasCidades(req: Request, res: Response) {
  try {
    const cidades = await prisma.cidade.findMany({
      select: {
        id: true,
        nome: true,
      },
    });
    res.status(200).json(cidades);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
export async function buscarCidadesPorEstados(req: Request, res: Response) {
  try {
    const cidadeSchema = z.object({
      estadoId: z.string(),
    });

    const { estadoId } = cidadeSchema.parse(req.params);

    const estado = await prisma.estado.findUnique({
      where: { id: estadoId },
      select: { id: true },
    });

    if (!estado) return res.status(404).json({ error: "Estado não econtrado" });

    const cidades = await prisma.cidade.findMany({
      where: {
        estado_id: estadoId,
      },
    });

    res.status(200).json(cidades);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Dados inváldos", issues: z.treeifyError(error) });
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
// export async function criarUsuario(req: Request, res: Response) {
// }
