import { studentPrisma } from "../../../prisma/clients.js";

export default async function create(body: {
    id: string,
}) {
    return await studentPrisma.findUnique({
        where: {
            id: body.id
        }
    });
}