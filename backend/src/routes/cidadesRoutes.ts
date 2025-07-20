import express from "express";
import { buscarCidadesPorEstados, buscarTodasCidades } from "src/controllers/cidadesController";

const cidadesRouter = express.Router();

cidadesRouter.get("/todas", buscarTodasCidades);
cidadesRouter.get("/:estadoId", buscarCidadesPorEstados);

export default cidadesRouter;
