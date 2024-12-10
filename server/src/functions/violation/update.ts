import { violationPrisma } from "../../../prisma/clients.js";

export default async function update(body: {
    id: string,
    student_id: string,
    reason: string,
}) {
    return await violationPrisma.update({
        where: {
            id: body.id
        },
        data: {
            student: {
                connect: {
                    id: body.student_id
                }
            },
            reason: body.reason,
        }
    });
}