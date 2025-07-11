import bcrypt from "bcrypt";

import apagarArquivos from "../utils/apagarArquivos.js";
import prisma from "../utils/prisma.js";

export async function atualizarAvatar(req, res) {
  try {
    const avatar = req.file;
    const { usuarioId } = req;
    if (!avatar) {
      return res.status(400).json({ erro: "Nenhum arquivo foi enviado." });
    }

    const usuario = await prisma.user.findUnique({
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

    await prisma.user.update({
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

export async function buscarTodosPerfis(req, res) {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        nome: true,
        foto_url: true,
        criado_em: true,
      },
    });
    if (!usuarios.length) {
      res.status(401).json({ error: "Nenhum usuario cadastrado" });
    }
    res.status(200).json(usuarios);
  } catch {
    res.status(500).json({ error: "Erro interno ao buscar os usuarios" });
  }
}

export async function buscarPerfilUsuario(req, res) {
  try {
    const { usuarioId } = req;
    const usuario = await prisma.user.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nome: true,
        email: true,
        foto_url: true,
        atualizado_em: true,
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

export async function atualizarNome(req, res) {
  try {
    const { usuarioId } = req;
    const { nome } = req.body;
    const usuario = await prisma.user.findUnique({
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

    await prisma.user.update({
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

export async function alterarSenha(req, res) {
  try {
    const { usuarioId } = req;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      res.status(400).json({ error: "Dados inválidos" });
      return;
    }

    const usuario = await prisma.user.findUnique({
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

    await prisma.user.update({
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

export async function deletarUsuario(req, res) {
  try {
    const { usuarioId } = req;

    const usuario = await prisma.user.findUnique({ where: { id: usuarioId } });

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

    await prisma.user.delete({ where: { id: usuarioId } });

    res.status(200).json({ messagem: "Usuario deletado com sucesso" });
  } catch {
    res.status(500).json({ error: "Erro interno ao tentar deletar usuarios" });
  }
}
