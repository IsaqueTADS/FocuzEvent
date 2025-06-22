import "dotenv/config";

import jwt from "jsonwebtoken";

const autenticacao = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decodificado.usuarioId;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

export default autenticacao;
