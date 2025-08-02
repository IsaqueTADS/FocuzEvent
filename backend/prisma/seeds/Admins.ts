import prisma from "src/utils/prisma";

import bcrypt from "bcrypt";

export default async function Admins() {
  let senha = "evento123";
  await prisma.usuario.createMany({
    data: [
      {
        nome: "IsaqueADM",
        email: "isaqueadm@gmail.com",
        senha: await bcrypt.hash(senha, 10),
        role: "ADMIN",
      },
      {
        nome: "EliziaADM",
        email: "eliziaadm@gmail.com",
        senha: await bcrypt.hash(senha, 10),
        role: "ADMIN",
      },
      {
        nome: "FarleyADM",
        email: "farleyadm@gmail.com",
        senha: await bcrypt.hash(senha, 10),
        role: "ADMIN",
      },
      {
        nome: "RodrigoADM",
        email: "rodrigoadm@gmail.com",
        senha: await bcrypt.hash(senha, 10),
        role: "ADMIN",
      },
      {
        nome: "WellytonADM",
        email: "wellytonadm@gmail.com",
        senha: await bcrypt.hash(senha, 10),
        role: "ADMIN",
      },
      {
        nome: "LilianADM",
        email: "lilianadm@gmail.com",
        senha: await bcrypt.hash(senha, 10),
        role: "ADMIN",
      },
    ],
    skipDuplicates: true,
  });
}
