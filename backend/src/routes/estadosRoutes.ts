import express from "express";
import { buscarTodosEventos } from "src/controllers/eventosControllers";

const estadosRouter = express.Router();

estadosRouter.get("/todos", buscarTodosEventos);

export default estadosRouter;
