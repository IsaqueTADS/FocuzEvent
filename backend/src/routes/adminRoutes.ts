import express from "express";
import {
  atualizarimpulso,
  buscarAdmin,
} from "src/controllers/adminControllers";
import verificarAdmin from "src/middlewares/adminMiddleware";
import autenticacao from "src/middlewares/authMiddleware";

const admRouter = express.Router();
admRouter.use(autenticacao, verificarAdmin);
admRouter.get("/me", autenticacao, verificarAdmin, buscarAdmin);
admRouter.put("/impulso/:impulsoId", atualizarimpulso);

export default admRouter;
