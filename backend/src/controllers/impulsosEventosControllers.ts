import { Request, Response } from "express";
import stripe from "src/config/stripe";
import apagarArquivos from "src/utils/apagarArquivos";
import prisma from "src/utils/prisma";
import { AuthRequest } from "src/utils/type";
import z from "zod";

export async function criarImpulso(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;

    const impulsoSchema = z.object({
      eventoId: z.string(),
      impulsoId: z.string(),
      dataHoraInicio: z.iso.datetime(),
      dataHoraFim: z.iso.datetime(),
    });

    const { eventoId, impulsoId, dataHoraInicio, dataHoraFim } = impulsoSchema.parse(req.body);

    const evento = await prisma.evento.findFirst({
      where: {
        id: eventoId,
        usuario_id: usuarioId,
      },
      include: {
        ImpulsoEventos: true,
      },
    });

    if (!evento) {
      res.status(404).json({ error: "Evento não econtrado." });
      return;
    }

    const impulsosConflitantes = await prisma.impulsoEvento.findMany({
      where: {
        evento_id: eventoId,
        status_pagamento: {
          in: ["AGUARDANDO", "PAGO"],
        },
        data_hora_inicio: { lte: dataHoraFim },
        data_hora_fim: { gte: dataHoraInicio },
      },
    });

    if (impulsosConflitantes.length > 0) {
      res.status(400).json({
        error:
          "O periodo do impulso conflita com outro impulso existente ou em aguardo de pagamento.",
      });
      return;
    }

    const inicio = new Date(dataHoraInicio);
    const fim = new Date(dataHoraFim);

    const dataAtual = new Date();

    const dataFimEvento = new Date(evento.data_hora_fim);

    if (inicio < dataAtual) {
      res.status(400).json({
        Error: "A data e hora de inicio não pode ser inferior a data atual",
      });
      return;
    }

    if (inicio > dataFimEvento) {
      res.status(400).json({
        error:
          "A data e hora de incio do impulso não pode ser maior que a data e hora final do evento.",
      });
      return;
    }

    if (fim > dataFimEvento) {
      res.status(400).json({
        error:
          "A data e hora de fim do impulso não pode ser maior que a data final do evento.",
      });
      return;
    }

    if (fim <= inicio) {
      res.status(400).json({
        error: "A data e hora final deve ser maior que a data inicial.",
      });
      return;
    }

    const diferencaMs = fim.getTime() - inicio.getTime();
    const diferencaDias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

    const impulso = await prisma.impulso.findUnique({
      where: {
        id: impulsoId,
      },
      select: {
        id: true,
        valor: true,
      },
    });

    if (!impulso) {
      res.status(404).json({ error: "Impulso não encontrado." });
      return;
    }

    const novoImpulso = await prisma.impulsoEvento.create({
      data: {
        data_hora_inicio: dataHoraInicio,
        data_hora_fim: dataHoraFim,
        valor_total: impulso.valor.mul(diferencaDias),
        evento_id: eventoId,
        impulso_id: impulsoId,
        metodo_pagamento: "",
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `http://localhost:5173/sucesso?impulso_id=${novoImpulso.id}`,
      cancel_url: `http://localhost:5173/erro?impulso_id=${novoImpulso.id}`,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Impulsionamento de Evento",
            },
            unit_amount: Math.round(novoImpulso.valor_total.toNumber() * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        impulso_evento_id: novoImpulso.id,
      },
      payment_method_types: ["card"],
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Dados inválidos", messagem: z.treeifyError(error) });
      return;
    }
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function atualizarBannerImpulso(req: Request, res: Response) {
  try {
    const { impulsoId } = req.params;

    const impulsoEvento = await prisma.impulsoEvento.findFirst({
      where: {
        id: impulsoId,
      },
      select: {
        id: true,
        banner_url: true,
      },
    });

    if (impulsoEvento?.banner_url) {
      apagarArquivos(impulsoEvento?.banner_url, "impulsos");
    }

    const bannerImpulso = req.file;
    const urlBanner = `http://localhost:3000/uploads/impulsos/${bannerImpulso?.filename}`;

    await prisma.impulsoEvento.update({
      where: {
        id: impulsoEvento?.id,
      },
      data: {
        banner_url: urlBanner,
      },
    });

    res
      .status(200)
      .json({ messagem: "Banner do impulso atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function buscarEventosImpulsionadoUsuario(
  req: Request,
  res: Response
) {
  try {
    const { usuarioId } = req as AuthRequest;

    const impulsos = await prisma.impulsoEvento.findMany({
      where: {
        evento: {
          usuario_id: usuarioId,
        },
      },
    });

    if (impulsos.length === 0) {
      res.status(404).json({ error: "Nenhum impulso econtrado." });
    }

    res.status(200).json(impulsos);
  } catch {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
