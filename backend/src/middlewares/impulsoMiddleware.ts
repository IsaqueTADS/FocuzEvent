import { Response, Request, NextFunction } from "express";
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

    console.log(impulsoId);

    if (!impulsoId) {
      return res.status(400).json({ erro: "ID do impulso não informado." });
    }

    const pago = await prisma.impulsoEvento.findFirst({
      where: {
        id: impulsoId,
        evento: {
          usuario_id: usuarioId,
        },
        status_pagamento: "PAGO",
      },
    });

    if (!pago) {
      return res
        .status(403)
        .json({ erro: "Impulso ainda não foi pago ou foi recusado." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export default verificarPagamentoImpulso;
