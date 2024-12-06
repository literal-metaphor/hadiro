import { PrismaClient } from "@prisma/client";

export const userPrisma = new PrismaClient().users;
export const studentPrisma = new PrismaClient().students;