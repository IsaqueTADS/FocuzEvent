import { Response, Request } from "express";
import prisma from "src/utils/prisma";
import { AuthRequest } from "src/utils/type";
import { z } from "zod";

export async function criarEvento(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;
    const bannerEvento = req.file;

    const eventoSchema = z.object({
      titulo: z.string().min(1),
      descricao: z.string().min(1),
      data_hora_inicio: z.iso.datetime(),
      data_hora_fim: z.iso.datetime(),
      latitude: z.string(),
      longitude: z.string(),
      cidade_id: z.string(),
    });

    console.log(req.body);

    const {
      titulo,
      descricao,
      data_hora_fim,
      data_hora_inicio,
      latitude,
      longitude,
      cidade_id,
    } = eventoSchema.parse(req.body);

    const urlBannerEvento = `http://localhost:3000/eventos/${bannerEvento?.filename}`;

    await prisma.evento.create({
      data: {
        titulo,
        descricao,
        banner_evento_url: urlBannerEvento,
        data_hora_inicio,
        data_hora_fim,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        cidade_id,
        usuario_id: usuarioId,
      },
    });

    console.log(usuarioId);

    res.status(201).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Dados inváldos" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function buscarTodosEventos(req: Request, res: Response) {
  const eventos = await prisma.evento.findMany();
  res.status(200).json(eventos);
}
