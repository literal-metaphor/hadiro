import { guestPrisma } from "../../../prisma/clients.js";

export default async function destroy(body: {
    id: string,
}) {
    return await guestPrisma.update({
        where: {
            id: body.id
        },
        data: {
            is_deleted: true
        }
    });
}