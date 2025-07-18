import prisma from "src/utils/prisma";
import seedEstados from "./seeds/Estado";
import seedCidades from "./seeds/Cidade";

async function main() {
  // await seedEstados();
  await seedCidades();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
