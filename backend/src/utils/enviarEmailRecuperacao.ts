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
    from: "Suporte Focuz <focuz@event.com>",
    to: email,
    subject: "Recuperação de senha",
    html: `
    <p>Olá,</p>

    <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>

    <p>Para continuar, utilize o código de verificação abaixo:</p>

    <h2 style="letter-spacing: 2px;">${codigo}</h2>

    <p>
      Este código é válido por <strong>15 minutos</strong>.
      Após esse período, será necessário solicitar uma nova recuperação de senha.
    </p>

    <p>
      <strong>Atenção:</strong><br />
      Caso você <strong>não tenha solicitado</strong> a redefinição de senha,
      recomendamos que altere sua senha imediatamente e entre em contato com nosso suporte. focuz@event.com
    </p>

    <p>
      Este é um e-mail automático. Por favor, <strong>não responda</strong> a esta mensagem.
    </p>

    <p>
      Atenciosamente,<br />
      <strong>Equipe Focuz</strong>
    </p>
  `,
  });
}
