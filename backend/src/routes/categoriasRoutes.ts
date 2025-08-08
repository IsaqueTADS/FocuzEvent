import express from "express";
import buscarCategorias from "src/controllers/categoriasController";

const categoriaRouter = express.Router();

categoriaRouter.get("/", buscarCategorias);

export default categoriaRouter;
