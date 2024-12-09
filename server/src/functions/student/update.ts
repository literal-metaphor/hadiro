import { studentPrisma } from "../../../prisma/clients.js";

export default async function create(body: {
    id: string,
    name: string,
    grade: string,
    class_code: string,
    department: string,
    descriptor: string,
    photo_path: string,
}) {
    const id = body.id;
    const data = { ...body };
    data.id = undefined as unknown as string;

    return await studentPrisma.update({
        where: {
            id
        },
        data
    });
}