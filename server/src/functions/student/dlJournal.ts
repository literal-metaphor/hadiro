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

        // const { monday, friday } = getMonFri(); // * Use this one for prod
        const { monday, friday } = {
            monday: new Date("2024-11-17"),
            friday: new Date("2024-11-24")
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

        // TODO:
        // 1. Heading and formalities and stuff
        // 2. Table for students attendances

        const dd: TDocumentDefinitions = {
            content: [
                {
                    image: `assets/JatimLogo.jpg`,
                    width: 88,
                    height: 127,
                },
                {
                    table: {
                        // headers are automatically repeated if the table spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 1,
                        widths: [ '*', 'auto', 100, '*' ],
                
                        body: [
                            [ 'First', 'Second', 'Third', 'The last one' ],
                            [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
                            [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ],
                        ]
                    }
                }
            ],
            defaultStyle: {
                font: 'Times'
            }
        }

        const file = await generatePdf(dd);

        // TODO: Delete pdf-lib
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${`Jurnal ${grade} ${department} ${class_code} Tanggal ${monday.toLocaleDateString("id-ID")} - ${friday.toLocaleDateString("id-ID")}.pdf`}`);
        return res.send(file);
    } catch (e) {
        if (e instanceof HttpError)
            return res.status(e.statusCode).json({ error: e.message });

        return res.status(500).json({ error: "Internal server error, please try again." });
    }
}