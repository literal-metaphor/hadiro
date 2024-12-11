import { randomUUID } from "crypto";
import { inattendancePrisma, notificationPrisma } from "../../../prisma/clients.js"

async function notify() {
    const today = new Date().toISOString().split('T')[0];

    // Fetch today's inattendance records
    const todayInattendance = await inattendancePrisma.findMany({
        where: {
            created_at: today,
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