import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../utils/prisma.js";
import { Request, Response } from "express";
import { env } from "src/env/index.js";

export async function criarUsuario(req: Request, res: Response) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      res.status(400).json({ error: "dados inválidos" });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (usuario) {
      res.status(403).json({ error: "Email já cadastrado" });
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
      },
    });
    res.status(201).json({ message: "Usuario criado com sucesso" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro interno no servidor ao cadastrar usuario" });
  }
}
export async function logarUsuario(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      res.status(400).json({ error: "dados inválidos" });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      res.status(400).json({ error: "Senha ou email inválidos" });
      return;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      res.status(401).json({ error: "Senha incorreta" });
      return;
    }

    const token = jwt.sign({ usuarioId: usuario.id }, env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res.status(200).json({ token });
  } catch {
    res.status(500).json({ error: "Erro interno ao tentar logar usuarios" });
  }
}

export async function verificarToken(req: Request, res: Response) {
  res.status(200).json({ ok: true });
}
