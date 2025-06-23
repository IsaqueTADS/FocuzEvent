import express from "express";

import {
  atualizarAvatar,
  buscarTodosPerfis,
  criarUsuario,
  logarUsuario,
} from "../controllers/authController.js";
import autenticacao from "../middlewares/authMiddleware.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";

const authRouter = express.Router();

authRouter.post("/cadastrar", criarUsuario);
authRouter.post("/logar", logarUsuario);
authRouter.get("/usuarios", buscarTodosPerfis);
authRouter.patch("/avatar", autenticacao, uploadAvatar.single("avatar"), atualizarAvatar);

export default authRouter;
