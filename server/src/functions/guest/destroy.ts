import { guestPrisma } from "../../../prisma/clients.js";

export default async function destroy(body: {
    id: string,
}) {
    return await guestPrisma.update({
        where: {
            id: body.id,
            is_deleted: false
        },
        data: {
            is_deleted: true
        }
    });
}