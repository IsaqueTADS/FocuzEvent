import { Request, Response } from "express";
import { stripe } from "src/config/stripe";
import { env } from "src/env";
import prisma from "src/utils/prisma";
import Stripe from "stripe";

export const webhookStripe = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let eventoStripe;

  if (!sig || typeof sig !== "string") {
    return res.status(400).send("Assinatura Stripe inválida");
  }

  try {
    eventoStripe = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    console.log("Erro ao verificar assinatura");
    return res.status(400).send("Webhook inválido");
  }
  if (eventoStripe.type === "checkout.session.completed") {
    const session = eventoStripe.data.object as Stripe.Checkout.Session;

    const impulsoEventoId = session.metadata?.impulso_evento_id;

    const paymentIntentId = session.payment_intent as string;

    if (!paymentIntentId) {
      console.warn("Nenhum payment_intent encontrado na sessão.");
      return;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const metodo = paymentIntent.payment_method_types[0];

    await prisma.impulsoEvento.update({
      where: { id: impulsoEventoId },
      data: { status_pagamento: "PAGO", metodo_pagamento: metodo },
    });

    const impulsoEvento = await prisma.impulsoEvento.findUnique({
      where: {
        id: impulsoEventoId,
      },
      include: {
        evento: true,
      },
    });

    const evento = await prisma.evento.update({
      where: {
        id: impulsoEvento?.evento_id,
      },
      data: {
        is_impulsonado: true,
      },
    });

    console.log(`Pagamento aprovado para impulso ${impulsoEventoId}`);
  }

  if (eventoStripe.type === "checkout.session.expired") {
    const session = eventoStripe.data.object as Stripe.Checkout.Session;
    const impulsoEventoId = session.metadata?.impulso_evento_id;

    await prisma.impulsoEvento.update({
      where: { id: impulsoEventoId },
      data: { status_pagamento: "RECUSADO" },
    });

    console.log(`Pagamento expirado para impulso ${impulsoEventoId}`);
  }

  res.status(200).send();
};
