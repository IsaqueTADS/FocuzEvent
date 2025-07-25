import prisma from "src/utils/prisma";

export default async function Categoria() {
  await prisma.categoriaEvento.createMany({
    data: [
      { titulo: "Shows & Música" },
      { titulo: "Educação" },
      { titulo: "Tecnologia" },
      { titulo: "Arte & Cultura" },
      { titulo: "Esportes" },
      { titulo: "Família" },
      { titulo: "Gastronomia" },
      { titulo: "Negócios" },
      { titulo: "Comunidade" },
      { titulo: "Games" },
      { titulo: "Religioso" },
      { titulo: "Tradições Locais" },
      { titulo: "Gospel" },
    ],
    skipDuplicates: true,
  });
}
