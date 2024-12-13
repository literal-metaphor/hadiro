import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { studentPrisma } from "../../../prisma/clients.js";
import { Request, Response } from "express";
import Joi from "joi";
import { StudentGradeEnum } from "../../utils/enums/StudentGrade.js";
import { StudentDepartmentEnum } from "../../utils/enums/StudentDepartment.js";
import HttpError from "../../utils/errors/HttpError.js";
import getMonFri from "../../utils/misc/getMondayFridayThisWeek.js";

// * SPECIAL ENDPOINT
export default async function dlJournal(req: Request, res: Response) {
    try {
        const { grade, class_code, department } = req.query;
        const validation = Joi.object({
            grade: Joi.string()
                .required()
                .valid(...Object.keys(StudentGradeEnum))
            ,
            class_code: Joi.string()
                .required()
            ,
            department: Joi.string()
                .required()
                .valid(...Object.keys(StudentDepartmentEnum))
            ,
        }).validate({
            grade,
            class_code,
            department
        });

        // const { monday, friday } = getMonFri(); // * Use this one for prod
        const { monday, friday } = {
            monday: new Date("2024-11-10"),
            friday: new Date("2024-11-17")
        };
        const where = validation.value;
        where.is_deleted = false;
        const data = (await studentPrisma.findMany({
            where,
            orderBy: {
                name: "asc"
            },
            omit: {
                descriptor: true,
            },
            include: {
                attendance: {
                    where: {
                        created_at: {
                            gte: monday,
                            lte: friday
                        },
                        is_deleted: false
                    }
                }
            },
        }));

        // I love it when pdf-lib says "It's pdf-ing time" and pdf-ed all over the place
        const pdf = await PDFDocument.create();
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        
        let page = pdf.addPage()
        const { width, height } = page.getSize()
        
        let i = 0;
        const table = data.map((d) => {
            const newPage = i % 10 === 0 && i > 0;
            if (newPage) i = 0;
            i++;

            const attendances = new Array(5).fill("");
            const days = [1,2,3,4,5];
            days.forEach(day => {
                for (const att of d.attendance) {
                  if (day === att.created_at.getDay()) {
                    attendances[day] = att.status;
                  }
                }
            });

            // for (const att of d.attendance) {
            //   if (today === att.created_at.getDay()) {
            //     attendances[today] = "HADIR";
            //   }
            // }
            
            // for (const inatt of d.inattendance) {
            //   if (today === inatt.created_at.getDay()) {
            //     attendances[today] = inatt.reason;
            //   }
            // }
            return {
                x: 80,
                y: height - ((i + 4) * 30),
                size: 9,
                text: d.name + attendances.join(","),
                newPage,
            }
        });

        // Draw heading
        page.drawText(`JURNAL KEHADIRAN SISWA ${grade} ${department} ${class_code}`, {
            // x: (width / 2) - (font.widthOfTextAtSize(`JURNAL KEHADIRAN SISWA ${grade} ${department} ${class_code}`, 13)),
            x: 80,
            y: height - 80,
            size: 13,
        });

        // Draw table data
        for (const t of table) {
            if (t.newPage) page = pdf.addPage();
            page.drawText(t.text, {
                x: t.x,
                y: t.y,
                size: t.size,
                font,
                color: rgb(0,0,0),
            })
        }
        
        pdf.setTitle(`Jurnal ${grade} ${department} ${class_code}`)
        const file = await pdf.save();

        // res.setHeader('Content-Disposition', `attachment; filename=${`Jurnal ${grade} ${department} ${class_code} Tanggal ${monday.toLocaleDateString("id-ID")} - ${friday.toLocaleDateString("id-ID")}.pdf`}`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${`Jurnal ${grade} ${department} ${class_code} Tanggal ${monday.toLocaleDateString("id-ID")} - ${friday.toLocaleDateString("id-ID")}.pdf`}`);
        return res.send(Buffer.from(file));
    } catch (e) {
        if (e instanceof HttpError)
            return res.status(e.statusCode).json({ error: e.message });

        return res.status(500).json({ error: "Kesalahan server, mohon coba lagi." });
    }
}