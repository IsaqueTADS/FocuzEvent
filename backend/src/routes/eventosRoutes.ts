import express from "express";
import {
  atualiarEvento,
  buscarEvento,
  buscarEventoImpulsionadoUnico,
  buscarEventosCidade,
  buscarEventosFiltrados,
  buscarEventosImpulsionado,
  buscarEventosUsuario,
  buscarTodosEventos,
  criarEvento,
} from "src/controllers/eventosControllers";
import { buscarEventosImpulsionadoUsuario } from "src/controllers/impulsosEventosControllers";
import autenticacao from "src/middlewares/authMiddleware";
import uploadBannerEventos from "src/middlewares/uploadBannerEvento";

const eventosRouter = express.Router();
eventosRouter.get("/todos", buscarTodosEventos);
eventosRouter.get("/cidade", buscarEventosCidade);
eventosRouter.get("/me", autenticacao, buscarEventosUsuario);
eventosRouter.get("/", buscarEventosFiltrados);
eventosRouter.post(
  "/criar",
  autenticacao,
  uploadBannerEventos.single("banner_evento"),
  criarEvento
);
eventosRouter.get("/:eventoId", buscarEvento);
eventosRouter.put(
  "/atualizar/:eventoId",
  autenticacao,
  uploadBannerEventos.single("atualizar_banner_evento"),
  atualiarEvento
);
eventosRouter.get("/todos/impulsionados", buscarEventosImpulsionado);
eventosRouter.get(
  "/unico/impulsionado/:impulsoEventoId",
  buscarEventoImpulsionadoUnico
);

export default eventosRouter;
