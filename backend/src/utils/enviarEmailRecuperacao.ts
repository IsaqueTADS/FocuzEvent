import nodemailer from "nodemailer";
import { env } from "src/env";

const transportadorEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USUARIO,
    pass: env.EMAIL_SENHA_APP,
  },
});

export default async function enviarEmailRecuperacao(
  email: string,
  codigo: string,
) {
  await transportadorEmail.sendMail({
    from: "Suporte <focuz@event.com>",
    to: email,
    subject: "Recuperação de senha",
    html: `
      <p>Use o código abaixo para redefinir sua senha:</p>
      <h2>${codigo}</h2>
      <p>Este código expira em 15 minutos.</p>
    `,
  });
}
