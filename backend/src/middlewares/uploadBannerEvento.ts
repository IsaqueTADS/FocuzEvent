import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const armazenamneto = multer.diskStorage({
  destination: (req, file, cb) => {
    const pastaDestino = path.join(__dirname, "../uploads/eventos");

    fs.mkdirSync(pastaDestino, { recursive: true });

    cb(null, pastaDestino);
  },
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);
    const nomeArquivo = `${uuidv4()}${extensao}`;
    cb(null, nomeArquivo);
  },
});

const uploadBannerEventos = multer({
  storage: armazenamneto,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg"];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não permitido. Use JPG ou PNG."));
    }
  },
});

export default uploadBannerEventos;
