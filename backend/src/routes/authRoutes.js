import express from "express";

import { criarUsuario, logarUsuario } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", criarUsuario);
authRouter.post("/login", logarUsuario);

export default authRouter;
