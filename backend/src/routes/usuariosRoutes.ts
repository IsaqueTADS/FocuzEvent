import express, { RequestHandler } from "express";

import {
  alterarSenha, atualizarAvatar, atualizarNome, buscarPerfilUsuario,
  buscarTodosPerfis,
  deletarUsuario,
} from "../controllers/usuariosController";
import autenticacao from "../middlewares/authMiddleware";
import uploadAvatar from "../middlewares/uploadAvatar";

const usuarioRouter = express.Router();

usuarioRouter.get("/", buscarTodosPerfis);
usuarioRouter.patch("/me/avatar", autenticacao as RequestHandler, uploadAvatar.single("avatar"), atualizarAvatar);
usuarioRouter.get("/me", autenticacao as RequestHandler, buscarPerfilUsuario);
usuarioRouter.patch("/me/nome", autenticacao as RequestHandler, atualizarNome);
usuarioRouter.patch("/me/senha", autenticacao as RequestHandler, alterarSenha);
usuarioRouter.delete("/me/delete", autenticacao, deletarUsuario);

export default usuarioRouter;
