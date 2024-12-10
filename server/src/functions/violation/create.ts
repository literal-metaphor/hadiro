import { randomUUID } from "crypto";
import { violationPrisma } from "../../../prisma/clients.js";

export default async function create(body: {
    student_id: string,
    reason: string,
}) {
    return await violationPrisma.create({
        data: {
            id: randomUUID(),
            student: {
                connect: {
                    id: body.student_id
                }
            },
            reason: body.reason,
        }
    });
}