import prisma from "src/utils/prisma";
import seedEstados from "./seeds/Estado";
import seedCidades from "./seeds/Cidade";
import Categoria from "./seeds/Categoria";
import Impulso from "./seeds/Impulso";
import Admins from "./seeds/Admins";

async function main() {
  // await seedEstados();
  // await seedCidades();
  // await Categoria();
  // await Impulso();
  // await Admins();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
