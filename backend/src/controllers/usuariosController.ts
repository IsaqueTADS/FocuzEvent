import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { AuthRequest } from "src/utils/type.js";
import z from "zod";

import apagarArquivos from "../utils/apagarArquivos.js";
import prisma from "../utils/prisma.js";

export async function atualizarAvatar(req: Request, res: Response) {
  try {
    const avatar = req.file;
    const { usuarioId } = req as AuthRequest;
    if (!avatar) {
      return res.status(400).json({ erro: "Nenhum arquivo foi enviado." });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        foto_url: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (usuario.foto_url) {
      apagarArquivos(usuario.foto_url, "perfis");
    }

    const urlAvatar = `http://localhost:3000/uploads/perfis/${avatar.filename}`;

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { foto_url: urlAvatar },
    });

    return res.status(200).json({
      messagem: "Avatar atualizado com sucesso.",
    });
  } catch {
    return res
      .status(500)
      .json({ error: "Erro interno ao atualizar o avatar." });
  }
}

export async function buscarTodosPerfis(req: Request, res: Response) {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {
        role: "USUARIO",
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        foto_url: true,
        criado_em: true,
      },
    });

    if (!usuarios.length) {
      res.status(401).json({ error: "Nenhum usuário encontrado." });
      return;
    }
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno ao buscar os usuários." });
  }
}

export async function buscarPerfilUsuario(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;
    const usuario = await prisma.usuario.findFirst({
      where: { id: usuarioId, role: "USUARIO" },
      select: {
        id: true,
        nome: true,
        email: true,
        foto_url: true,
        atualizado_em: true,
        role: true,
        criado_em: true,
      },
    });

    if (!usuario) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    res.status(200).json(usuario);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro interno ao buscar o perfil do usuário." });
  }
}

export async function atualizarNome(req: Request, res: Response) {
  try {
    const nomeSchme = z.object({
      nome: z.string(),
    });
    const { usuarioId } = req as AuthRequest;
    const { nome } = nomeSchme.parse(req.body);
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nome: true },
    });

    if (!usuario) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    if (!nome) {
      res.status(400).json({ error: "Dados inválidos. " });
      return;
    }

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        nome,
      },
    });

    res.status(200).json({ messagem: "Nome atualizado com sucesso." });
  } catch {
    res.status(500).json({ error: "Erro interno ao atualizar o nome." });
  }
}

export async function alterarSenha(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      res.status(400).json({ error: "Dados inválidos. " });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuario) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);

    if (!senhaValida) {
      res.status(403).json({ error: "Senha atual incorreta." });
      return;
    }

    if (senhaAtual === novaSenha) {
      res
        .status(403)
        .json({ error: "A nova senha deve ser diferente da atual." });
      return;
    }

    const novaSenhahash = await bcrypt.hash(novaSenha, 10);

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { senha: novaSenhahash },
    });

    res.status(200).json({ messagem: "Senha atualizada com sucesso." });
  } catch {
    res.status(500).json({ error: "Erro interno ao atualizar a senha." });
  }
}

export async function deletarUsuario(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    await prisma.evento.updateMany({
      where: {
        usuario_id: usuarioId,
      },
      data: {
        ativo: false,
      },
    });

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        ativo: false,
        email: `descartado_${usuario.email}_${usuario.id}`,
      },
    });

    res.status(200).json({ messagem: "Usuário excluído com sucesso." });
  } catch {
    res.status(500).json({ error: "Erro interno ao excluir o usuário." });
  }
}
