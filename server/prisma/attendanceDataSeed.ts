import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { InattendanceReasonEnum } from '../src/utils/enums/InattendanceReason.js';
import { attendancePrisma, inattendancePrisma, studentPrisma } from './clients.js';

try {
    const currentDate = new Date();
    const studentDatas = await studentPrisma.findMany();
    for (const studentData of studentDatas) {
        for (let i = 30; i > 0; i--) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() - i);

            const isAttending = Math.random() < 0.8;
            if (isAttending) {
                const data = {
                    id: randomUUID(),
                    student: {
                        connect: {
                            id: studentData.id
                        }
                    },
                    created_at: date,
                    updated_at: date
                } as Prisma.attendancesCreateInput;

                await attendancePrisma.create({
                    data
                });

                console.log(`Attending on ${date.toLocaleDateString("en-US")}: ${studentData.name}`);
            }
            else {
                const reason = Object.keys(InattendanceReasonEnum)[Math.floor(Math.random() * Object.keys(InattendanceReasonEnum).length)];
                const data = {
                    id: randomUUID(),
                    reason,
                    evidence_photo_path: "nothing :))",
                    student: {
                        connect: {
                            id: studentData.id
                        }
                    },
                    created_at: date,
                    updated_at: date
                } as Prisma.inattendancesCreateInput;

                await inattendancePrisma.create({
                    data
                });

                console.log(`Not attending ${date.toLocaleDateString("en-US")}: ${studentData.name}`)
            }

            setTimeout(() => {
                return;
            }, 10);
        }
    }
} catch (err) {
    console.error(err);
    process.exit(1);
}