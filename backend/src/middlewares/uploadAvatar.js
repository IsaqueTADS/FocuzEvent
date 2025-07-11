import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const armazenamneto = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/perfis"));
  },
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);
    const nomeArquivo = `${uuidv4()}${extensao}`;
    cb(null, nomeArquivo);
  },
});

const uploadAvatar = multer({
  storage: armazenamneto,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg"];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não permitido. Use JPG ou PNG."));
    }
  },
});

export default uploadAvatar;
