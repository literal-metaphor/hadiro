import { inattendancePrisma } from "../../../prisma/clients.js";

export default async function update(body: {
    id: string,
    student_id: string,
    reason: string,
    evidence_photo_path: string
}) {
    return await inattendancePrisma.update({
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
            evidence_photo_path: body.evidence_photo_path,
        }
    });
}