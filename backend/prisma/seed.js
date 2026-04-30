import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "Test@12345";

const seedUsers = [
  { name: "Test Admin", email: "admin@test.com", role: "ADMIN" },
  { name: "Member One", email: "member1@test.com", role: "MEMBER" },
  { name: "Member Two", email: "member2@test.com", role: "MEMBER" },
  { name: "Member Three", email: "member3@test.com", role: "MEMBER" },
  { name: "Member Four", email: "member4@test.com", role: "MEMBER" },
];

const main = async () => {
  const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const user of seedUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        password: hashed,
      },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        password: hashed,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seed completed: 1 admin + 4 members created/updated.");
};

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
