const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Log available models
  console.log("Available Prisma models:");
  console.log(Object.keys(prisma));

  // Test database connection
  try {
    const result = await prisma.$queryRaw`SELECT 1+1 AS result`;
    console.log("Database connection successful:", result);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
