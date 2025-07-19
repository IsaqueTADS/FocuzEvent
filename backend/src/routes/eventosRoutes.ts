import express from "express";
import {
  buscarEventosCidade,
  buscarEventosUsuario,
  buscarTodosEventos,
  criarEvento,
} from "src/controllers/eventosControllers";
import autenticacao from "src/middlewares/authMiddleware";
import uploadBannerEventos from "src/middlewares/uploadBannerEvento";

const eventosRouter = express.Router();
eventosRouter.get("/todos", buscarTodosEventos);
eventosRouter.get("/cidade", buscarEventosCidade);
eventosRouter.get("/me", autenticacao, buscarEventosUsuario);
eventosRouter.use(autenticacao);
eventosRouter.post(
  "/criar",
  autenticacao,
  uploadBannerEventos.single("banner_evento"),
  criarEvento
);

export default eventosRouter;
