import { guestPrisma } from "../../../prisma/clients.js";

export default async function show(body: {
    id: string,
}) {
    return await guestPrisma.findUnique({
        where: {
            id: body.id,
            is_deleted: false
        }
    });
}