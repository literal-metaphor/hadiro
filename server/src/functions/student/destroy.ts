import { studentPrisma } from "../../../prisma/clients.js";

export default async function destroy(body: {
    id: string,
}) {
    return await studentPrisma.update({
        where: {
            id: body.id
        },
        data: {
            is_deleted: true
        }
    });
}