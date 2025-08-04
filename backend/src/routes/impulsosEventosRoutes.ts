import express from "express";
import { criarImpulso } from "src/controllers/impulsosEventosControllers";

import verificarAdmin from "src/middlewares/adminMiddleware";
import autenticacao from "src/middlewares/authMiddleware";

const impulsosEventosRouter = express.Router();

impulsosEventosRouter.post("/criar", autenticacao, criarImpulso);

export default impulsosEventosRouter;
