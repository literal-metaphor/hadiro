import { randomUUID } from "crypto";
import { inattendancePrisma, notificationPrisma } from "../../../prisma/clients.js";
import { InattendanceReasonEnum } from "../../utils/enums/InattendanceReason.js"; 

export default async function create(body: {
    student_id: string,
    reason: string,
    evidence_photo_path: string
}) {
    const inattendance = await inattendancePrisma.create({
        data: {
            id: randomUUID(),
            student: {
                connect: {
                    id: body.student_id
                }
            },
            reason: body.reason,
            evidence_photo_path: body.evidence_photo_path,
        },
        include: {
            student: true, 
        }
    });

    if (inattendance.reason != InattendanceReasonEnum.TK) {
        let message;
        const studentName = inattendance.student.name;
        switch (inattendance.reason) {
            case InattendanceReasonEnum.IZIN:
            case InattendanceReasonEnum.SAKIT:
                message = `${studentName} telah mengirim surat izin.`;
                break;
            case InattendanceReasonEnum.DISPEN:
                message = `${studentName} telah mengirim surat dispensasi.`;
                break;
            default:
                message = `${studentName} telah mengirim surat.`;
                break;
        }

        await notificationPrisma.create({
            data: {
                id: randomUUID(),
                message: message,
                attachment_path: inattendance.evidence_photo_path,
            }
        });
    }

    return inattendance;
}