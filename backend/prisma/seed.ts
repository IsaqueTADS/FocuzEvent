import prisma from "src/utils/prisma";
import seedEstados from "./seeds/Estado";

async function main() {
  await seedEstados();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
