import { attendancePrisma, inattendancePrisma } from "../../../prisma/clients.js"

export default async function insight(body: {
    // attendance?: boolean
}) {
    // Get all records from the entire month ago
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(today.getDate() - 30);
    const [attendances, inattendances] = await Promise.all([
        (async () => {
            return await attendancePrisma.findMany({
                where: {
                    created_at: {
                        gte: oneMonthAgo,
                        lte: today
                    }
                },
                include: {
                    student: {
                        select: {
                            name: true
                        }
                    }
                }
            });
        })(),
        (async () => {
            return await inattendancePrisma.findMany({
                where: {
                    created_at: {
                        gte: oneMonthAgo,
                        lte: today
                    }
                },
                include: {
                    student: {
                        select: {
                            name: true
                        }
                    }
                }
            });
        })(),
    ]);

    // Process each records
    let records = [] as {
        name: string,
        attendances: Array<{
            time: Date
        }>,
        inattendances: Array<{
            reason: string
        }>
    }[];

    await Promise.all([
        (async (): Promise<void> => {
            for (const val of attendances) {
                const found = records.findIndex(record => record.name === val.student.name);
                if (found !== -1) {
                    records[found].attendances.push({ time: val.created_at });
                } else {
                    records.push({
                        name: val.student.name,
                        attendances: [{
                            time: val.created_at
                        }],
                        inattendances: [],
                    });
                }
            }
        })(),
        (async (): Promise<void> => {
            for (const val of inattendances) {
                const found = records.findIndex(record => record.name === val.student.name);
                if (found !== -1) {
                    records[found].inattendances.push({ reason: val.reason });
                } else {
                    records.push({
                        name: val.student.name,
                        attendances: [],
                        inattendances: [{
                            reason: val.reason
                        }],
                    });
                }
            }
        })(),
    ]);

    return records.map(val => {
        return {
            name: val.name,

            latestAttendance: val.attendances.length > 0
            ? val.attendances.reduce((minDate, current) => current.time > minDate ? current.time : minDate, val.attendances[0].time)
                .toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })
            : 'none',

            attendanceRatio: val.attendances.length + val.inattendances.length > 0
            ? `${(val.attendances.length / (val.attendances.length + val.inattendances.length) * 100).toFixed(0)}%`
            : '0%',

            attendanceTimeAvg: val.attendances.length > 0
            ? (() => {
                const totalTime = val.attendances.reduce((acc, attendance) =>
                    acc + (attendance.time.getHours() * 3600000) + (attendance.time.getMinutes() * 60000) + (attendance.time.getSeconds() * 1000) + attendance.time.getMilliseconds(),
                    0
                );
                const avgTime = totalTime / val.attendances.length;
                const hours = Math.floor(avgTime / 3600000);
                const minutes = Math.floor((avgTime % 3600000) / 60000);
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            })()
            : 'none',

            mostInattendanceReason: val.inattendances.length > 0
            ? (() => {
                const reasons = val.inattendances.reduce((acc, inattendance) => {
                    acc[inattendance.reason] = (acc[inattendance.reason] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);
        
                let mode = ''; // For my Indonesian friends "modus statistik"
                let max = 0;
                for (const r in reasons) {
                    if (reasons[r] > max) {
                        mode = r;
                        max = reasons[r];
                    }
                }
                return mode;
            })()
            : 'none',
        }
    });
}