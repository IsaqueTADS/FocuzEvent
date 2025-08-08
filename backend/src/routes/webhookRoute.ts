import express from "express";
import webhookStripe from "src/controllers/webhookController";

const webhookRouter = express.Router();

webhookRouter.post("/stripe", express.raw({ type: "application/json" }), webhookStripe);

export default webhookRouter;
