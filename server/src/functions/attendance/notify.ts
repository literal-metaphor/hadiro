import { randomUUID } from "crypto";
import { attendancePrisma, notificationPrisma } from "../../../prisma/clients.js"
import { AttendanceStatusEnum } from "../../utils/enums/AttendanceStatus.js";

async function notify() {
    const today = new Date().toISOString().split('T')[0];

    // Fetch today's inattendance records
    const todayInattendance = await attendancePrisma.findMany({
        where: {
            created_at: today,
            is_deleted: false,
            status: {
                not: AttendanceStatusEnum.HADIR
            }
        },
        include: {
            student: true,
        },
    });

    // Create inattendance count notification
    const inattendanceCount = todayInattendance.length;
    await notificationPrisma.create({
        data: {
            id: randomUUID(),
            message: `Jumlah ketidakhadiran hari ini: ${inattendanceCount}`,
        },
    });
}