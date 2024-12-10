import { attendancePrisma } from "../../../prisma/clients.js";

export default async function show(body: {
    id: string,
}) {
    return await attendancePrisma.findUnique({
        where: {
            id: body.id
        }
    });
}