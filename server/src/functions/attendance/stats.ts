import { attendancePrisma } from "../../../prisma/clients.js";
import { AttendanceStatusEnum } from "../../utils/enums/AttendanceStatus.js";

export default async function stats(body: {
    from: Date,
    until: Date
}) {
    const { from, until } = body;

    until.setDate(until.getDate() + 1);

    const attendances = (await attendancePrisma.findMany({
        where: {
            status: AttendanceStatusEnum.HADIR,
            created_at: {
                gte: from,
                lte: until
            },
            is_deleted: false
        }
    })).map(val => val.created_at);

    const inattendances = (await attendancePrisma.findMany({
        where: {
            status: {
                not: AttendanceStatusEnum.HADIR,
            },
            created_at: {
                gte: from,
                lte: until
            },
            is_deleted: false
        }
    })).map(val => val.status);

    return {
        attendances,
        inattendances
    }
}