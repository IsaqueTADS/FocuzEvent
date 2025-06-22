import express from "express";

import {
  atualizarAvatar,
  criarUsuario,
  logarUsuario,
} from "../controllers/authController.js";
import autenticacao from "../middlewares/authMiddleware.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";

const authRouter = express.Router();

authRouter.post("/cadastrar", criarUsuario);
authRouter.post("/logar", logarUsuario);
authRouter.use(autenticacao);
authRouter.patch("/avatar", uploadAvatar.single("avatar"), atualizarAvatar);

export default authRouter;
