import { violationPrisma } from "../../../prisma/clients.js";

export default async function show(body: {
    id: string,
}) {
    return await violationPrisma.findUnique({
        where: {
            id: body.id
        }
    });
}