import { inattendancePrisma } from "../../../prisma/clients.js";

export default async function destroy(body: {
    id: string,
}) {
    return await inattendancePrisma.update({
        where: {
            id: body.id
        },
        data: {
            is_deleted: true
        }
    });
}