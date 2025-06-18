import bcrypt from "bcrypt";

import prisma from "../utils/prisma.js";

export async function criarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      res.status(404).json({ error: "dados inválidos" });
      return;
    }

    const UsuarioExiste = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (UsuarioExiste) {
      res.status(400).json({ error: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
      },
    });
    res.status(200).json({ message: "Usuario criado com sucesso" });
  } catch (error) {
    console.error(error);
  }
}
export async function logarUsuario(req, res) {
  res.status(200);
}
