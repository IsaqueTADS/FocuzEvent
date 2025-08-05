import { Request, Response } from "express";
import { stripe } from "src/config/stripe";
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

    const { eventoId, impulsoId, dataHoraInicio, dataHoraFim } =
      impulsoSchema.parse(req.body);

    const inicio = new Date(dataHoraInicio);
    const fim = new Date(dataHoraFim);

    const evento = await prisma.evento.findFirst({
      where: {
        id: eventoId,
        usuario_id: usuarioId,
      },
    });

    if (!evento) {
      return res.status(404).json({ error: "Evento não econtrado." });
    }

    const dataInicioEvento = new Date(evento.data_hora_inicio);
    const dataFimEvento = new Date(evento.data_hora_fim);


    if (inicio > dataFimEvento) {
      return res.status(400).json({
        error:
          "A data de incio do impulso não pode ser maior que a data final do evento.",
      });
    }

    if (fim > dataFimEvento) {
      return res.status(400).json({
        error:
          "A data de fim do impulso não pode ser maior que a data final do evento.",
      });
    }

    if (fim <= inicio) {
      return res
        .status(400)
        .json({ error: "A data final deve ser maior que a data inicial." });
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
      return res.status(404).json({ error: "Impulso não encontrado." });
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
      return res
        .status(400)
        .json({ error: "Dados inválidos", messagem: z.treeifyError(error) });
    }
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

// export async function buscarImpulso(req: Request, res: Response) {
//   try {

//   } catch (error) {
//     res.status(500).json({ error: "Erro interno no servidor." });
//   }
// }



// export async function buscarImpulso(req: Request, res: Response) {
//   try {

//   } catch (error) {
//     res.status(500).json({ error: "Erro interno no servidor." });
//   }
// }
