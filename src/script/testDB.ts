import { prisma } from "../lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "demo@bpibank.test",
      name: "Demo User",
    },
  });

  console.log("Created user:");
  console.log(user);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });