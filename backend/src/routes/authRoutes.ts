import express from "express";

import {
  criarUsuario,
  logarUsuario,
  verificarToken,
} from "../controllers/authControllers";
import autenticacao from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.post("/register", criarUsuario);
authRouter.post("/login", logarUsuario);
authRouter.get("/token/validar", autenticacao, verificarToken);

export default authRouter;
