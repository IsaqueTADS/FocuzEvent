import prisma from "src/utils/prisma";

export default async function Impulso() {
  await prisma.impulso.create({
    data: {
      valor: 10,
    },
  });
}
