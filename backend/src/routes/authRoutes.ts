import express from "express";

import {
  criarUsuario,
  logarUsuario,
  recuperarSenha,
  redefinirSenha,
  verificarToken,
} from "../controllers/authControllers";
import autenticacao from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.post("/register", criarUsuario);
authRouter.post("/login", logarUsuario);
authRouter.post("/recuperar-senha", recuperarSenha);
authRouter.post("/redefinir-senha", redefinirSenha);
authRouter.get("/token/validar", autenticacao, verificarToken);

export default authRouter;
