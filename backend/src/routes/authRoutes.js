import express from "express";

import {
  criarUsuario,
  logarUsuario,
  postarAvatar,
} from "../controllers/authController.js";
import autenticacao from "../middlewares/authMiddleware.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";

const authRouter = express.Router();

authRouter.post("/cadastrar", criarUsuario);
authRouter.post("/logar", logarUsuario);
authRouter.use(autenticacao);
authRouter.post("/avatar", uploadAvatar.single("avatar"), postarAvatar);

export default authRouter;
