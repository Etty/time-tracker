import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding database...");

  // Create sample projects
  const project1 = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Project A",
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: "Project B",
    },
  });

  const project3 = await prisma.project.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: "Project C",
    },
  });

  console.log("Created projects:", { project1, project2, project3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
