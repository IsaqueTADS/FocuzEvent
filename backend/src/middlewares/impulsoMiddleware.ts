import { NextFunction, Request, Response } from "express";
import prisma from "src/utils/prisma";
import { AuthRequest } from "src/utils/type";

const verificarPagamentoImpulso = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { impulsoId } = req.params;
    const { usuarioId } = req as AuthRequest;
    const dataAtual = new Date();

    if (!impulsoId) {
      res.status(400).json({ erro: "ID do impulso não informado." });
      return;
    }

    const pago = await prisma.impulsoEvento.findFirst({
      where: {
        id: impulsoId,
        data_hora_fim: {
          gte: dataAtual,
        },
        evento: {
          usuario_id: usuarioId,
        },
        status_pagamento: "PAGO",
      },
    });

    if (!pago) {
      res
        .status(403)
        .json({ erro: "Impulso ainda não foi pago ou foi recusado." });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export default verificarPagamentoImpulso;
