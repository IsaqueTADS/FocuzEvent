import bcrypt from "bcrypt";

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
  res.status(200);
}

export async function postarAvatar(req, res) {
  try {
    const arquivo = req.file;
    console.log(arquivo);

    if (!arquivo) {
      return res.status(400).json({ erro: "Nenhum arquivo foi enviado." });
    }

    const urlImagem = `http://localhost:3000/${arquivo.filename}`;

    return res.status(200).json({
      mensagem: "Arquivo enviado com sucesso!",
      nome: arquivo.filename,
      caminho: arquivo.path,
      urlImagem,
    });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}
