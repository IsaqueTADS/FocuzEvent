import { Request, Response } from "express";
import { stripe } from "src/config/stripe";
import { env } from "src/env";
import prisma from "src/utils/prisma";

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
    const session = eventoStripe.data.object as any;

    const impulsoEventoId = session.metadata.impulso_evento_id;

    await prisma.impulsoEvento.update({
      where: { id: impulsoEventoId },
      data: { status_pagamento: "PAGO" },
    });

    console.log(`Pagamento aprovado para impulso ${impulsoEventoId}`);
  }

  if (eventoStripe.type === "checkout.session.expired") {
    const session = eventoStripe.data.object as any;
    const impulsoEventoId = session.metadata.impulso_evento_id;

    await prisma.impulsoEvento.update({
      where: { id: impulsoEventoId },
      data: { status_pagamento: "RECUSADO" },
    });

    console.log(`Pagamento expirado para impulso ${impulsoEventoId}`);
  }

  res.status(200).json(eventoStripe);
};