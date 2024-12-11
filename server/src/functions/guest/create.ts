import { randomUUID } from "crypto";
import { guestPrisma } from "../../../prisma/clients.js";

export default async function create(body: {
    name: string,
    instance: string,
    intention: string,
    problem: string,
    phone_number: string,
    photo_path: string,
}) {
    const data = {
        id: randomUUID(),
        ...body
    }

    return await guestPrisma.create({
        data
    });
}