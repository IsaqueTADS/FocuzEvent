import path from "path";
import prisma from "src/utils/prisma";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

interface EstadoObject {
  ID: string;
  Sigla: string;
  Nome: string;
}

interface CidadeObject {
  ID: string;
  Nome: string;
  Estado: string;
  uf: string;
}

export default async function seedCidades() {
  const estados = await prisma.estado.findMany();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const mapaUfParaId = new Map<string, string>();
  estados.forEach((estado) => {
    mapaUfParaId.set(estado.uf, estado.id);
  });

  const caminhoJson = path.resolve(__dirname, "../../jsonExterno/Cidades.json");
  const caminhoJson2 = path.resolve(
    __dirname,
    "../../jsonExterno/Estados.json"
  );

  const conteudo = await fs.readFile(caminhoJson, "utf-8");
  const cidadesBase = JSON.parse(conteudo);

  const response = await fs.readFile(caminhoJson2, "utf-8");
  const estadosBase = JSON.parse(response);

  const cidadesUf = estadosBase.flatMap((estado: EstadoObject) => {
    return cidadesBase
      .filter((cidade: CidadeObject) => cidade.Estado === estado.ID)
      .map((cidade: CidadeObject) => {
        return {
          Nome: cidade.Nome,
          uf: estado.Sigla,
        };
      });
  });

  const cidadesFinal = cidadesUf.map((cidade: CidadeObject) => {
    const estado_id = mapaUfParaId.get(cidade.uf);
    return {
      nome: cidade.Nome,
      estado_id,
    };
  });

  await prisma.cidade.createMany({ data: cidadesFinal, skipDuplicates: true });
}
