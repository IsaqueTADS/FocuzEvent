import bcrypt from "bcrypt";

import apagarArquivos from "../utils/apagarArquivos.js";
import prisma from "../utils/prisma.js";
import { Request, Response } from "express";
import { AuthRequest } from "src/utils/type.js";

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
      return res.status(401).json({ error: "Usuario não existe" });
    }

    if (usuario.foto_url) {
      const url = new URL(usuario.foto_url);
      const partes = url.pathname.split("/");
      const nomeDoArquivo = partes[partes.length - 1];
      apagarArquivos(nomeDoArquivo, "perfis");
    }

    const urlAvatar = `http://localhost:3000/perfis/${avatar.filename}`;

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { foto_url: urlAvatar },
    });

    return res.status(200).json({
      messagem: "Upload do avatar completo com sucesso",
    });
  } catch {
    return res
      .status(500)
      .json({ error: "Erro interno ao fazer upload avatar" });
  }
}

export async function buscarTodosPerfis(req: Request, res: Response) {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        foto_url: true,
        criado_em: true,
      },
    });

    if (!usuarios.length) {
      res.status(401).json({ error: "Nenhum usuario cadastrado" });
    }
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno ao buscar os usuarios" });
  }
}

export async function buscarPerfilUsuario(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
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
      res.status(401).json({ error: "Usuario não econtrado" });
      return;
    }

    res.status(200).json(usuario);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro interno no servidor ao buscar usuario" });
  }
}

export async function atualizarNome(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;
    const { nome } = req.body;
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nome: true },
    });

    if (!usuario) {
      res.status(401).json({ error: "Usuario não econtrado" });
      return;
    }

    if (!nome) {
      res.status(400).json({ error: "Dados inválidos" });
      return;
    }

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        nome,
      },
    });

    res.status(200).json({ messagem: "Nome atualizado com sucesso" });
  } catch {
    res.status(500).json({ error: "Erro interno ao atualizar o nome" });
  }
}

export async function alterarSenha(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      res.status(400).json({ error: "Dados inválidos" });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuario) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);

    if (!senhaValida) {
      res.status(403).json({ error: "Senha atual incorreta" });
      return;
    }

    if (senhaAtual === novaSenha) {
      res
        .status(403)
        .json({ error: "A nova senha deve ser diferente da senha atual" });
      return;
    }

    const novaSenhahash = await bcrypt.hash(novaSenha, 10);

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { senha: novaSenhahash },
    });

    res.status(200).json({ messagem: "Senha atualizada com sucesso" });
  } catch {
    res
      .status(500)
      .json({ error: "Erro interno no servidor ao tentar alterar senha" });
  }
}

export async function deletarUsuario(req: Request, res: Response) {
  try {
    const { usuarioId } = req as AuthRequest;

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      res.status(401).json({ error: "Usuario não econtrado" });
      return;
    }

    if (usuario.foto_url != null) {
      const url = new URL(usuario.foto_url);
      const partes = url.pathname.split("/");
      const nomeDoArquivo = partes[partes.length - 1];
      apagarArquivos(nomeDoArquivo, "perfis");
    }

    await prisma.usuario.delete({ where: { id: usuarioId } });

    res.status(200).json({ messagem: "Usuario deletado com sucesso" });
  } catch {
    res.status(500).json({ error: "Erro interno ao tentar deletar usuarios" });
  }
}
