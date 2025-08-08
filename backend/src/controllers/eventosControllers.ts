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
      categoriaEventoId: z.string(),
      isEventoPago: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
      }, z.boolean()),
      telefoneContato: z
        .string()
        .min(10)
        .max(15)
        .regex(/^([1-9]{2})(9?[0-9]{8})$/)
        .optional(),
      instagram: z.string().startsWith("@").min(2).max(50).optional(),
      emailContato: z.email().optional(),
    });

    const {
      titulo,
      descricao,
      dataHoraInicio,
      dataHoraFim,
      latitude,
      longitude,
      cidadeId,
      categoriaEventoId,
      isEventoPago,
      telefoneContato,
      instagram,
      emailContato,
    } = eventoSchema.parse(req.body);

    const urlBannerEvento = `http://localhost:3000/uploads/eventos/${bannerEvento?.filename}`;

    const cidade = await prisma.cidade.findUnique({
      where: {
        id: cidadeId,
      },
    });

    if (!cidade) {
      res.status(404).json({ error: "Essa cidade não existe" });
      return;
    }
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
        categoria_evento_id: categoriaEventoId,
        is_evento_pago: isEventoPago,
        telefone_contato: telefoneContato,
        instagram,
        email_contato: emailContato,
      },
    });

    res.status(201).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Dados inválidos" });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function buscarTodosEventos(req: Request, res: Response) {
  try {
    const eventos = await prisma.evento.findMany({
      where: {
        ativo: true,
        usuario: {
          role: "USUARIO",
        },
      },
      include: {
        cidade: {
          select: {
            id: true,
            nome: true,
            estado: { select: { id: true, uf: true, nome: true } },
          },
        },
        usuario: { select: { id: true, nome: true } },
        categoriaEvento: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
    });
    if (eventos.length === 0) {
      res.status(404).json({ error: "Nenhum evento econtrado" });
      return;
    }

    res.status(200).json(eventos);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function buscarEventosUsuario(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;
    const eventosUsuario = await prisma.evento.findMany({
      where: { usuario_id: usuarioId, ativo: true },
      include: {
        cidade: {
          select: {
            nome: true,
            estado: { select: { id: true, uf: true, nome: true } },
          },
        },
        usuario: { select: { id: true, nome: true } },
        categoriaEvento: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
    });

    if (eventosUsuario.length === 0) {
      res.status(404).json({ error: "Nenhum evento econtrado" });
      return;
    }

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

    return;
    if (!cidade) {
      res.status(404).json({ error: "Cidade não econtrada" });
      return;
    }

    const eventosCidade = await prisma.evento.findMany({
      where: {
        cidade_id,
        ativo: true,
        usuario: {
          role: "USUARIO",
        },
      },
      include: {
        cidade: {
          select: {
            nome: true,
            estado: { select: { id: true, uf: true, nome: true } },
          },
        },
        usuario: { select: { nome: true } },
        categoriaEvento: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
    });

    if (eventosCidade.length === 0) {
      res.status(404).json({ error: "Nenhum evento econtrado" });
      return;
    }

    res.status(200).json(eventosCidade);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Dados inválidos" });
      return;
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
        categoriaEvento: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
    });

    if (!evento) {
      res.status(404).json({ error: "Nenhum evento econtrado" });
      return;
    }

    if (evento.ativo === false) {
      res.status(404).json({ error: "Nenhum evento econtrado" });
      return;
    }

    await prisma.evento.update({
      where: {
        id: evento.id,
      },
      data: {
        acessos: {
          increment: 1,
        },
      },
    });

    res.status(200).json(evento);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function buscarEventosFiltrados(req: Request, res: Response) {
  try {
    const filtroScheme = z.object({
      cidadeId: z.string().optional(),
      categoriaEventoId: z.string().optional(),
      usuarioId: z.string().optional(),
      pagina: z
        .preprocess((val) => Number(val), z.number().int().min(1))
        .optional()
        .default(1),
      total: z
        .preprocess((val) => Number(val), z.number().int())
        .optional()
        .default(5),
    });
    const { cidadeId, categoriaEventoId, usuarioId, pagina, total } = filtroScheme.parse(req.query);

    const skip = (pagina - 1) * total;
    const take = total;

    const eventos = await prisma.evento.findMany({
      where: {
        ...(usuarioId ? { usuario_id: usuarioId } : {}),
        ...(cidadeId ? { cidade_id: cidadeId } : {}),
        ...(categoriaEventoId
          ? { categoria_evento_id: categoriaEventoId }
          : {}),
        usuario: {
          role: "USUARIO",
        },
      },
      skip,
      take,
      orderBy: {
        criado_em: "asc",
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
        categoriaEvento: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
    });

    if (eventos.length === 0) {
      res.status(404).json({ error: "Nenhum evento encontrado." });
      return;
    }

    res.status(200).json(eventos);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Dados inválidos" });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function atualiarEvento(req: Request, res: Response) {
  try {
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
        isEventoPago: z.preprocess((val) => {
          if (val === "true") return true;
          if (val === "false") return false;
          return val;
        }, z.boolean()),
        telefoneContato: z
          .string()
          .min(10)
          .max(15)
          .regex(/^([1-9]{2})(9?[0-9]{8})$/)
          .optional(),
        instagram: z.string().startsWith("@").min(2).max(50).optional(),
        emailContato: z.email().optional(),
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
      isEventoPago,
      telefoneContato,
      instagram,
      emailContato,
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
      res.status(404).json({ error: "Nenhum evento econtrado" });
      return;
    }

    if (evento.ativo === false) {
      res.status(404).json({ error: "Nenhum evento econtrado" });
      return;
    }

    const bannerEvento = req.file;
    if (bannerEvento) {
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
        ...(titulo !== undefined && { titulo }),
        ...(descricao !== undefined && { descricao }),
        ...(dataHoraInicio !== undefined && {
          data_hora_inicio: dataHoraInicio,
        }),
        ...(dataHoraFim !== undefined && { data_hora_fim: dataHoraFim }),
        ...(latitude !== undefined && { latitude: parseFloat(latitude) }),
        ...(longitude !== undefined && { longitude: parseFloat(longitude) }),
        ...(cidadeId !== undefined && { cidade_id: cidadeId }),
        ...(catagoriaEventoId !== undefined && {
          categoria_evento_id: catagoriaEventoId,
        }),
        ...(isEventoPago !== undefined && { is_evento_pago: isEventoPago }),
        ...(telefoneContato !== undefined && {
          telefone_contato: telefoneContato,
        }),
        ...(instagram !== undefined && { instagram }),
        ...(emailContato !== undefined && { email_contato: emailContato }),
      },
    });

    res.status(200).json({ messagem: "Evento atualizado com sucesso" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Dados inválidos", messagem: z.treeifyError(error) });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function buscarEventosImpulsionado(req: Request, res: Response) {
  try {
    const dataAtual = new Date();

    const impulsosEventos = await prisma.impulsoEvento.findMany({
      where: {
        status_pagamento: "PAGO",
        data_hora_fim: { gte: dataAtual },
        evento: {
          ativo: true,
          usuario: {
            role: "USUARIO",
          },
        },
      },
      select: {
        id: true,
        acessos: true,
        banner_url: true,
        evento: {
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
            categoriaEvento: {
              select: {
                id: true,
                titulo: true,
              },
            },
          },
        },
      },
    });

    if (impulsosEventos.length === 0) {
      res.status(404).json({ error: "Nenhum evento impulsionado econtrado." });
      return;
    }

    res.status(200).json(impulsosEventos);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function buscarEventoImpulsionadoUnico(
  req: Request,
  res: Response
) {
  try {
    const { impulsoEventoId } = req.params;
    const dataAtual = new Date();

    const evento = await prisma.impulsoEvento.findFirst({
      where: {
        id: impulsoEventoId,
        data_hora_fim: {
          gte: dataAtual,
        },
      },
      select: {
        id: true,
        banner_url: true,
        acessos: true,
        evento: {
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
            categoriaEvento: {
              select: {
                id: true,
                titulo: true,
              },
            },
          },
        },
      },
    });

    if (!evento) {
      res.status(404).json({ error: "Nenhum evento econtrado." });
      return;
    }

    await prisma.impulsoEvento.update({
      where: {
        id: evento.id,
      },
      data: {
        acessos: {
          increment: 1,
        },
      },
    });

    res.status(200).json(evento);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
