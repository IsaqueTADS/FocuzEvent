import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function apagarArquivos(nomeDoArquivo, subpasta) {
  const caminho = path.join(
    __dirname,
    "..",
    "uploads",
    subpasta,
    nomeDoArquivo,
  );

  console.log("caminho: ", caminho);

  fs.unlink(caminho, (erro) => {
    if (erro) {
      console.log("Erro ao apagar o arquivo:", erro.message);
    } else {
      console.log("Arquivo apagado com sucesso:", nomeDoArquivo);
    }
  });
}
