import { attendancePrisma } from "../../../prisma/clients.js";

export default async function show(body: {
    id: string,
}) {
    return await attendancePrisma.findUnique({
        where: {
            id: body.id,
            is_deleted: false
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