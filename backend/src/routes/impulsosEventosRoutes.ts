import express from "express";
import { atualizarimpulso } from "src/controllers/adminControllers";
import { atualizarBannerImpulso, criarImpulso } from "src/controllers/impulsosEventosControllers";

import verificarAdmin from "src/middlewares/adminMiddleware";
import autenticacao from "src/middlewares/authMiddleware";
import verificarPagamentoImpulso from "src/middlewares/impulsoMiddleware";
import uploadBannerEventos from "src/middlewares/uploadBannerEvento";
import uploadBannerImpulso from "src/middlewares/uploadBannerImpulso";

const impulsosEventosRouter = express.Router();

impulsosEventosRouter.post("/criar", autenticacao, criarImpulso);
impulsosEventosRouter.patch(
  "/atualizar/banner/:impulsoId",
  autenticacao,
  verificarPagamentoImpulso,
  uploadBannerImpulso.single("banner_evento_impulso"),
  atualizarBannerImpulso
);

export default impulsosEventosRouter;
