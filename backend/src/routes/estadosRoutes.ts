import express from "express";
import buscarTodosEstados from "src/controllers/estadosControllers";

const estadosRouter = express.Router();

estadosRouter.get("/todos", buscarTodosEstados);

export default estadosRouter;
