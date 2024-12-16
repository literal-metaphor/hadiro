import { studentPrisma } from "../../../prisma/clients.js";
import { Request, Response } from "express";
import { StudentGradeEnum } from "../../utils/enums/StudentGrade.js";
import { StudentDepartmentEnum } from "../../utils/enums/StudentDepartment.js";
import HttpError from "../../utils/errors/HttpError.js";
import Joi from "joi";
import getMonFri from "../../utils/misc/getMondayFridayThisWeek.js";
import pdfmake from "pdfmake";
import { createWriteStream, readFileSync, unlinkSync } from "fs";
import { randomUUID } from "crypto";
import { TDocumentDefinitions, TFontDictionary } from "pdfmake/interfaces.js";
import capitalizeStr from "../../utils/misc/capitalizeStr.js";

const StdFonts: TFontDictionary = {
    Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
    },
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    },
    Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
    },
    Symbol: {
        normal: 'Symbol'
    },
    ZapfDingbats: {
        normal: 'ZapfDingbats'
    }
};

async function generatePdf(dd: TDocumentDefinitions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const printer = new pdfmake(StdFonts);
        const pdfDoc = printer.createPdfKitDocument(dd);
        const filename = `${randomUUID()}.pdf`;
        const writeStream = createWriteStream(filename);

        pdfDoc.pipe(writeStream);

        writeStream.on('finish', () => {
            try {
                const file = readFileSync(filename);
                unlinkSync(filename);
                resolve(file);
            } catch (err) {
                reject(err);
            }
        });

        writeStream.on('error', (err) => {
            reject(err);
        });

        pdfDoc.end();
    });
}

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

        const { monday, friday } = getMonFri();
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
        if (data.length < 1) return res.status(404).json({
            message: "Data not found. Make sure grade, class code, and department is correct."
        });

        const tableData = data.map((d, i) => {
            return [
                i+1,
                capitalizeStr(d.name),
                d.attendance.find(val => new Date(val.created_at).getDay() === 1)?.status[0] || ``,
                d.attendance.find(val => new Date(val.created_at).getDay() === 2)?.status[0] || ``,
                d.attendance.find(val => new Date(val.created_at).getDay() === 3)?.status[0] || ``,
                d.attendance.find(val => new Date(val.created_at).getDay() === 4)?.status[0] || ``,
                d.attendance.find(val => new Date(val.created_at).getDay() === 5)?.status[0] || ``,
            ]
        });
        const docTitle = `Jurnal ${grade} ${department} ${class_code} ${monday.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} - ${friday.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
        const dd: TDocumentDefinitions = {
            content: [
                {
                    columns: [
                        {
                            image: `assets/LogoGrafika.png`,
                            width: 107,
                            height: 133,
                        },
                        {
                            width: "*",
                            text: [
                                {
                                    text: docTitle + "\n",
                                    bold: true,
                                    fontSize: 18,
                                    lineHeight: 1.5
                                },
                                {
                                    text: `Jl.Tanimbar No.22 Malang Telp. 0341-353798, Fax 0341-363099\n`,
                                    fontSize: 12,
                                    lineHeight: 1.5
                                },
                                {
                                    text: `Website : www.smkn4malang.sch.id. E-mail : mail@smkn4malang.sch.id\n`,
                                    fontSize: 12,
                                    lineHeight: 1.5
                                },
                                {
                                    text: `MALANG 65117`,
                                    bold: true,
                                    fontSize: 12,
                                    lineHeight: 1.5
                                },
                            ],
                            marginTop: 16,
                            marginLeft: 32
                        },
                    ],
                    // margin: [0,0,0,32], // left, top, right, bottom
                    marginBottom: 32,
                },
                {
                    table: {
                        // headers are automatically repeated if the table spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 1,
                        widths: [`auto`, `*`, `auto`, `auto`, `auto`, `auto`, `auto`,],
                
                        body: [
                            [
                                { text: 'No.', bold: true },
                                { text: 'Nama', bold: true },

                                { text: 'Senin', bold: true },
                                { text: 'Selasa', bold: true },
                                { text: 'Rabu', bold: true },
                                { text: 'Kamis', bold: true },
                                { text: 'Jumat', bold: true },
                            ],
                            ...tableData
                        ]
                    }
                }
            ],
            defaultStyle: {
                font: 'Times'
            },
            info: {
                title: docTitle
            }
        }

        const file = await generatePdf(dd);
        // This is just for previewing, the endpoint should just download the file
        // res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${`${`Jurnal ${grade} ${department} ${class_code} ${monday.toLocaleDateString("id-ID")} - ${friday.toLocaleDateString("id-ID")}`}.pdf`}`);
        return res.status(200).send(file);
    } catch (e) {
        if (e instanceof HttpError)
            return res.status(e.statusCode).json({ error: e.message });

        return res.status(500).json({ error: "Internal server error, please try again." });
    }
}