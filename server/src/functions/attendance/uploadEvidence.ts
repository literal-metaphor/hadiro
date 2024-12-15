import { writeFileSync } from "fs";
import fileCheck from "file-type-checker";
import HttpError from "../../utils/errors/HttpError.js";
import { randomUUID } from "crypto";

export default async function uploadEvidence(body: {
    file_base64: string,
}) {
    try {
        const file = Buffer.from(body.file_base64, "base64");
        let fileExt = ""
        if (fileCheck.isPDF(file)) fileExt = "pdf"
        if (fileCheck.isJPEG(file)) fileExt = "jpeg"
        if (fileCheck.isPNG(file)) fileExt = "png"
        if (fileExt === "") throw new HttpError(422, "File harus berupa .pdf, .jpg, atau .png");
    
        const fileName = `${randomUUID()}.${fileExt}`;
        writeFileSync(`uploads/${fileName}`, file);

        return {
            "filename": fileName
        }
    } catch (err) {
        throw new HttpError(500, "Kesalahan saat mengunggah file, mohon coba lagi");
    }
}