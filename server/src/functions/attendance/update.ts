import { attendancePrisma } from "../../../prisma/clients.js";

export default async function update(body: {
    id: string,
    student_id: string,
    status: string,
    evidence_photo_path: string | undefined
}) {
    return await attendancePrisma.update({
        where: {
            id: body.id,
            is_deleted: false
        },
        data: {
            status: body.status,
            evidence_photo_path: body.evidence_photo_path,
            student: {
                connect: {
                    id: body.student_id
                }
            }
        }
    });
}