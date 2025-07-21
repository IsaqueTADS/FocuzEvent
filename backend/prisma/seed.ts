import prisma from "src/utils/prisma";
import seedEstados from "./seeds/Estado";
import seedCidades from "./seeds/Cidade";
import { metodoPagamento } from "./seeds/MetodoDePagamento";

async function main() {
  // await seedEstados();
  // await seedCidades();
  await metodoPagamento();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
