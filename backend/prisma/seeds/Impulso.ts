import prisma from "src/utils/prisma";

export default async function Impulso() {
  const existe = await prisma.impulso.findFirst({
    where: { valor: 10 }, 
  });

  if (!existe) {
    await prisma.impulso.create({
      data: {
        valor: 10,
      },
    });
    console.log("Impulso criado");
  } else {
    console.log("Impulso já existe");
  }
}
