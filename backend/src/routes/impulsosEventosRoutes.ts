import express from "express";

import verificarAdmin from "src/middlewares/adminMiddleware";
import autenticacao from "src/middlewares/authMiddleware";

const impulsoRouter = express.Router();




export default impulsoRouter;
