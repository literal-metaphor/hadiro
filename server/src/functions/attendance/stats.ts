import { attendancePrisma, inattendancePrisma } from "../../../prisma/clients.js";

export default async function stats(body: {
    from: Date,
    until: Date
}) {
    const { from, until } = body;

    const attendances = (await attendancePrisma.findMany({
        where: {
            created_at: {
                gte: from,
                lte: until
            }
        }
    // })).map(val => {
    //     return {
    //         date: val.created_at,
    //     }  
    // });
    })).map(val => val.created_at);

    const inattendances = (await inattendancePrisma.findMany({
        where: {
            created_at: {
                gte: from,
                lte: until
            }
        }
    })).map(val => val.reason);

    return {
        attendances,
        inattendances
    }
}