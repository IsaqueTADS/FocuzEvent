import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import admRouter from "./routes/adminRoutes";
import authRouter from "./routes/authRoutes";
import cidadesRouter from "./routes/cidadesRoutes";
import eventosRouter from "./routes/eventosRoutes";
import usuarioRouter from "./routes/usuariosRoutes";
import { buscarTodosEstados } from "./controllers/estadosControllers";

const app = express();
app.use(express.json());
app.use(express.static("uploads"));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRouter);
app.use("/admin", admRouter);
app.use("/usuarios", usuarioRouter);
app.use("/eventos", eventosRouter);
app.use("/estados", buscarTodosEstados);
app.use("/cidades", cidadesRouter);

app.get("/", (req, res) => {
  res.send("🚀 Hello World");
});

export default app;
