import { Request, Response } from "express";
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

    res.status(201).send();
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

export async function buscarTodosEventos(req: Request, res: Response) {
  const eventos = await prisma.evento.findMany({
    include: {
      cidade: {
        select: { nome: true, estado: { select: { uf: true, nome: true } } },
      },
      usuario: { select: { id: true, nome: true } },
    },
  });
  res.status(200).json(eventos);
}

export async function buscarEventosUsuario(req: Request, res: Response) {
  const { usuarioId } = req as AuthRequest;
  const eventosUsuario = await prisma.evento.findMany({
    where: { usuario_id: usuarioId },
    include: {
      cidade: {
        select: { nome: true, estado: { select: { uf: true, nome: true } } },
      },
      usuario: { select: { id: true, nome: true } },
    },
  });

  res.status(200).json(eventosUsuario);
}

export async function buscarEventosCidade(req: Request, res: Response) {
  try {
    const cidadeSchema = z.object({
      cidade_id: z.string(),
    });
    const { cidade_id } = cidadeSchema.parse(req.query);

    const cidade = await prisma.cidade.findUnique({
      where: {
        id: cidade_id,
      },
    });

    if (!cidade) return res.status(404).json({ error: "Cidade não econtrada" });

    const eventosCidade = await prisma.evento.findMany({
      where: { cidade_id },
      include: {
        cidade: {
          select: { nome: true, estado: { select: { uf: true, nome: true } } },
        },
        usuario: { select: { id: true, nome: true } },
      },
    });

    res.status(200).json(eventosCidade);
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
