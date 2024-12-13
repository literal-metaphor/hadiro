import { randomUUID } from "crypto";
import { attendancePrisma } from "../../../prisma/clients.js";

export default async function create(body: {
    student_id: string,
    status: string,
    evidence_photo_path: string | undefined
}) {
    return await attendancePrisma.create({
        data: {
            id: randomUUID(),
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