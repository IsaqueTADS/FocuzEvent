import express from "express";

import {
  alterarSenha, atualizarAvatar, atualizarNome, buscarPerfilUsuario,
  buscarTodosPerfis,
  deletarUsuario,
} from "../controllers/usuariosController.js";
import autenticacao from "../middlewares/authMiddleware.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";

const usuarioRouter = express.Router();

usuarioRouter.get("/", buscarTodosPerfis);
usuarioRouter.patch("/me/avatar", autenticacao, uploadAvatar.single("avatar"), atualizarAvatar);
usuarioRouter.get("/me", autenticacao, buscarPerfilUsuario);
usuarioRouter.patch("/me/nome", autenticacao, atualizarNome);
usuarioRouter.patch("/me/senha", autenticacao, alterarSenha);
usuarioRouter.delete("/me/delete", autenticacao, deletarUsuario);

export default usuarioRouter;
