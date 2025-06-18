import express from "express";

import { criarUsuario } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/cadastrar", criarUsuario);

export default authRouter;
