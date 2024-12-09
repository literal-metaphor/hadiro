import { randomUUID } from "crypto";
import { attendancePrisma } from "../../../prisma/clients.js";

export default async function create(body: {
    student_id: string
}) {
    return await attendancePrisma.create({
        data: {
            id: randomUUID(),
            student: {
                connect: {
                    id: body.student_id
                }
            }
        }
    });
}