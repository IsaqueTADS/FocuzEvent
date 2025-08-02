import prisma from "src/utils/prisma";

export async function metodoPagamento() {
  const metodos = [{nome:"Pix"}];


  await prisma.metodoPagamento.createMany({
    data: metodos,
    skipDuplicates: true,
  });
}
