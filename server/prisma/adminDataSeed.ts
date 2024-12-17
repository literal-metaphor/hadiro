import { genSaltSync, hashSync } from "bcrypt";
import { userPrisma } from "./clients.js";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

async function main() {
    const admins: Prisma.usersCreateInput[] = [
        {
            id: randomUUID(),
            email: "superadmin@email.com",
            username: "superadmin",
            password: hashSync("Passw0rd", genSaltSync()),
            level: 3
        },
        {
            id: randomUUID(),
            email: "admin@email.com",
            username: "admin",
            password: hashSync("Passw0rd", genSaltSync()),
            level: 2
        },
        {
            id: randomUUID(),
            email: "user@email.com",
            username: "user",
            password: hashSync("Passw0rd", genSaltSync()),
            level: 1
        },
    ];

    for (let data of admins) {
        await userPrisma.create({data});
        console.log(`Success creating ${data.email}`);
    }
}

main();