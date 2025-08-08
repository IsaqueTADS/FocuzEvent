import { Request, Response } from "express";
import prisma from "src/utils/prisma";
import { AuthRequest } from "src/utils/type";
import z from "zod";

export async function buscarAdmin(req: Request, res: Response) {
  const { usuarioId } = req as AuthRequest;

  try {
    const usuarioAdmin = await prisma.usuario.findFirst({
      where: { id: usuarioId, role: "ADMIN" },
      select: {
        id: true,
        nome: true,
        role: true,
        email: true,
        foto_url: true,
        criado_em: true,
        atualizado_em: true,
      },
    });
    res.status(200).json(usuarioAdmin);
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function atualizarimpulso(req: Request, res: Response) {
  try {
    const impulsoIdSchema = z.object({
      impulsoId: z.string(),
    });
    const novoValorSchema = z.object({
      novoValor: z.number().min(1),
    });

    const { impulsoId } = impulsoIdSchema.parse(req.params);
    const { novoValor } = novoValorSchema.parse(req.body);

    const impulso = await prisma.impulso.findUnique({
      where: {
        id: impulsoId,
      },
    });

    if (!impulso) {
      res.status(404).json("Impulso não econtrado.");
      return;
    }

    await prisma.impulso.update({
      where: {
        id: impulsoId,
      },
      data: {
        valor: novoValor,
      },
    });

    res.status(200).json({ mensagem: "Valor do impulso atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Dados inválidos" });
      return;
    }
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
