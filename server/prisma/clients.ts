import { PrismaClient } from "@prisma/client";

export const userPrisma = new PrismaClient().users;