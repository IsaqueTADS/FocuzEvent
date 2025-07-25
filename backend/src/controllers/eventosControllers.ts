import { Request, Response } from "express";
import prisma from "src/utils/prisma";
import { AuthRequest } from "src/utils/type";
import { z } from "zod";
import apagarArquivos from "../utils/apagarArquivos";

export async function criarEvento(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;
    const bannerEvento = req.file;

    const eventoSchema = z.object({
      titulo: z.string().min(1),
      descricao: z.string().min(1),
      dataHoraInicio: z.iso.datetime(),
      dataHoraFim: z.iso.datetime(),
      latitude: z.string(),
      longitude: z.string(),
      cidadeId: z.string(),
      catagoriaEventoId : z.string()
    });

    const {
      titulo,
      descricao,
      dataHoraInicio,
      dataHoraFim,
      latitude,
      longitude,
      cidadeId,
      catagoriaEventoId,
    } = eventoSchema.parse(req.body);

    const urlBannerEvento = `http://localhost:3000/uploads/eventos/${bannerEvento?.filename}`;

    const cidade = await prisma.cidade.findUnique({
      where: {
        id: cidadeId,
      },
    });

    if (!cidade)
      return res.status(404).json({ error: "Essa cidade não existe" });

    await prisma.evento.create({
      data: {
        titulo,
        descricao,
        banner_evento_url: urlBannerEvento,
        data_hora_inicio: dataHoraInicio,
        data_hora_fim: dataHoraFim,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        cidade_id: cidadeId,
        usuario_id: usuarioId,
        categoria_evento_id:  catagoriaEventoId
      },
    });

    res.status(201).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Dados inváldos", messagem: z.treeifyError(error) });
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function buscarTodosEventos(req: Request, res: Response) {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        cidade: {
          select: { nome: true, estado: { select: { uf: true, nome: true } } },
        },
        usuario: { select: { id: true, nome: true } },
      },
    });
    if (eventos.length === 0)
      return res.status(404).json({ error: "Nenhum evento econtrado" });

    // await prisma.evento.deleteMany();
    res.status(200).json(eventos);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function buscarEventosUsuario(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;
    const eventosUsuario = await prisma.evento.findMany({
      where: { usuario_id: usuarioId },
      include: {
        cidade: {
          select: { nome: true, estado: { select: { uf: true, nome: true } } },
        },
        usuario: { select: { nome: true } },
      },
    });

    res.status(200).json(eventosUsuario);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
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
        usuario: { select: { nome: true } },
      },
    });

    res.status(200).json(eventosCidade);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Dados inváldos", messagem: z.treeifyError(error) });
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function buscarEvento(req: Request, res: Response) {
  try {
    const eventoSchema = z.object({
      eventoId: z.string(),
    });
    const { eventoId } = eventoSchema.parse(req.params);

    const evento = await prisma.evento.findUnique({
      where: {
        id: eventoId,
      },
      include: {
        cidade: {
          select: {
            nome: true,
            estado: { select: { uf: true, nome: true } },
          },
        },
        usuario: {
          select: {
            nome: true,
          },
        },
      },
    });

    if (!evento)
      return res.status(404).json({ error: "Nenhum evento econtrado" });

    res.status(200).json(evento);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function atualiarEvento(req: Request, res: Response) {
  const eventoSchema = z
    .object({
      titulo: z.string().min(1),
      descricao: z.string().min(1),
      dataHoraInicio: z.iso.datetime(),
      dataHoraFim: z.iso.datetime(),
      latitude: z.string(),
      longitude: z.string(),
      cidadeId: z.string(),
      catagoriaEventoId: z.string(),
    })
    .partial();

  const {
    titulo,
    descricao,
    dataHoraInicio,
    dataHoraFim,
    latitude,
    longitude,
    cidadeId,
    catagoriaEventoId,
  } = eventoSchema.parse(req.body);

  const { eventoId } = req.params;
  const { usuarioId } = req as AuthRequest;

  const evento = await prisma.evento.findFirst({
    where: {
      id: eventoId,
      usuario_id: usuarioId,
    },
  });

  if (!evento) {
    return res.status(404).json({ error: "Nenhum evento econtrado" });
  }

  const bannerEvento = req.file;
  if (bannerEvento) {
    console.log(evento.banner_evento_url);
    if (evento.banner_evento_url !== null) {
      apagarArquivos(evento.banner_evento_url, "eventos");
    }

    const urlBannerEvento = `http://localhost:3000/uploads/eventos/${bannerEvento?.filename}`;
    await prisma.evento.update({
      where: {
        id: eventoId,
      },
      data: {
        banner_evento_url: urlBannerEvento,
      },
    });
  }

  await prisma.evento.update({
    where: {
      id: eventoId,
    },
    data: {
      titulo,
      descricao,
      data_hora_inicio: dataHoraInicio,
      data_hora_fim: dataHoraFim,
      latitude,
      longitude,
      cidade_id: cidadeId,
      categoria_evento_id: catagoriaEventoId,
    },
  });

  res.status(200).send();

  try {
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Dados inváldos", messagem: z.treeifyError(error) });
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
