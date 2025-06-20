import express from "express";

import upload from "../config/multerConfig.js";
import { criarUsuario, postarAvatar } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/cadastrar", criarUsuario);
authRouter.post("/avatar", upload.single("avatar"), postarAvatar);

export default authRouter;
