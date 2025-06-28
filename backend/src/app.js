import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/authRoutes.js";
import usuarioRouter from "./routes/usuariosRoutes.js";

const app = express();
app.use(express.json());
app.use(express.static("uploads"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRouter);
app.use("/usuarios", usuarioRouter);

app.get("/", (req, res) => {
  res.send("🚀 Hello World");
});

export default app;
