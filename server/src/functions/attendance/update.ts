import { attendancePrisma } from "../../../prisma/clients.js";

export default async function update(body: {
    id: string,
    student_id: string,
}) {
    return await attendancePrisma.update({
        where: {
            id: body.id
        },
        data: {
            student: {
                connect: {
                    id: body.student_id
                }
            }
        }
    });
}