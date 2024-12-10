import { inattendancePrisma } from "../../../prisma/clients.js";

export default async function show(body: {
    id: string,
}) {
    return await inattendancePrisma.findUnique({
        where: {
            id: body.id
        }, 
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    grade: true,
                    class_code: true,
                    department: true,
                    photo_path: true,
                },
            },
        },
    });
}