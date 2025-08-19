import express from "express";
import buscarPlanoImpulso from "src/controllers/planoImpulsoControllers";
import autenticacao from "src/middlewares/authMiddleware";

const planoImpulsoRouter = express.Router();

planoImpulsoRouter.get("/plano", buscarPlanoImpulso);

export default planoImpulsoRouter;
