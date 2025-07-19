import express from "express";
import { buscarTodasCidades } from "src/controllers/cidadesController";

const cidadesRouter = express.Router();

cidadesRouter.get("todas", buscarTodasCidades);

export default cidadesRouter;
