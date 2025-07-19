import prisma from "src/utils/prisma";

import { Request, Response } from "express";

export async function buscarTodasCidades(req: Request, res: Response) {
  const cidades = prisma.cidade.findMany({
    select: {
      id: true,
      nome: true,
    },
  });

  res.status(200).json(cidades);
}
// export async function criarUsuario(req: Request, res: Response) {
// }
