import express from "express";

import upload from "../config/multerConfig.js";
import { criarUsuario, logarUsuario, postarAvatar } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/cadastrar", criarUsuario);
authRouter.post("/logar", logarUsuario);
authRouter.post("/avatar", upload.single("avatar"), postarAvatar);

export default authRouter;
