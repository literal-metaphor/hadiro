import { attendancePrisma, inattendancePrisma } from "../../../prisma/clients.js";

export default async function quickStats(data: {
    from: Date,
    until: Date
}) {
    const { from, until } = data;

    const attendances = await attendancePrisma.findMany({
        where: {
            created_at: {
                gte: from,
                lte: until
            }
        }
    });

    const inattendances = await inattendancePrisma.findMany({
        where: {
            created_at: {
                gte: from,
                lte: until
            }
        }
    });

    return {
        attendances,
        inattendances
    }
}