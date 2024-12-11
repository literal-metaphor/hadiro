import { guestPrisma } from "../../../prisma/clients.js";

export default async function update(body: {
    id: string,
    name: string,
    instance: string,
    intention: string,
    problem: string,
    phone_number: string,
    photo_path: string,
}) {
    return await guestPrisma.update({
        where: {
            id: body.id
        },
        data: {
            name: body.name,
            instance: body.instance,
            intention: body.intention,
            problem: body.problem,
            phone_number: body.phone_number,
            photo_path: body.photo_path,
        }
    });
}