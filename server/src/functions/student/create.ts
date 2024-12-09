import { randomUUID } from "crypto";
import { studentPrisma } from "../../../prisma/clients.js";

export default async function create(body: {
    name: string,
    grade: string,
    class_code: string,
    department: string,
    descriptor: string,
    photo_path: string,
}) {
    const data = {
        id: randomUUID(),
        ...body
    }

    return await studentPrisma.create({
        data
    });
}