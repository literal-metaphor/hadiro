import { genSaltSync, hashSync } from "bcrypt";
import { userPrisma } from "./clients";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";

async function main() {
    const admins: Prisma.usersCreateInput[] = [
        {
            id: uuidv4(),
            email: "superadmin@email.com",
            username: "superadmin",
            password: hashSync("Passw0rd", genSaltSync()),
            level: 3
        },
        {
            id: uuidv4(),
            email: "admin@email.com",
            username: "admin",
            password: hashSync("Passw0rd", genSaltSync()),
            level: 2
        },
        {
            id: uuidv4(),
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