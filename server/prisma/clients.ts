import { PrismaClient } from "@prisma/client";

export const userPrisma = new PrismaClient().users;
export const studentPrisma = new PrismaClient().students;
export const attendancePrisma = new PrismaClient().attendances;
export const inattendancePrisma = new PrismaClient().inattendances;
export const violationPrisma = new PrismaClient().violations;
export const guestPrisma = new PrismaClient().guests;