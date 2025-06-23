import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import apagarArquivos from "../utils/apagarArquivos.js";
import prisma from "../utils/prisma.js";

export async function criarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      res.status(400).json({ error: "dados inválidos" });
      return;
    }

    const usuarioExiste = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (usuarioExiste) {
      res.status(403).json({ error: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await prisma.user.create({
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
export async function logarUsuario(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      res.status(400).json({ error: "dados inválidos" });
      return;
    }

    const usuario = await prisma.user.findUnique({
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

    const token = jwt.sign({ usuarioId: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno ao tentar logar usuarios" });
  }
}

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
      // console.log(usuario.foto_url?.split("/")[4]);

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
    console.log(usuarios);
    res.status(200).json(usuarios);
  } catch {
    res.status(500).json({ error: "Erro interno ao buscar os usuarios" });
  }
}
