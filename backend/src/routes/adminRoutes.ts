import express from "express";
import { buscarAdmin } from "src/controllers/adminControllers";
import verificarAdmin from "src/middlewares/adminMiddleware";
import autenticacao from "src/middlewares/authMiddleware";

const admRouter = express.Router();

admRouter.get("/me", autenticacao, verificarAdmin, buscarAdmin);

export default admRouter;
