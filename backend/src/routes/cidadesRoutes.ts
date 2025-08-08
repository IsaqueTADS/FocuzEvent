import express from "express";
import {
  buscarCidadesPorEstados,
  buscarTodasCidades,
} from "src/controllers/cidadesControllers";

const cidadesRouter = express.Router();

cidadesRouter.get("/todas", buscarTodasCidades);
cidadesRouter.get("/:estadoId", buscarCidadesPorEstados);

export default cidadesRouter;
