import Joi from "joi";
import { AttendanceStatusEnum } from "../../enums/AttendanceStatus.js";

export default function schema() {
    return Joi.object({
        id: Joi.string().required(),
        student_id: Joi.string().required(),
        status: Joi.string().required().valid(...Object.keys(AttendanceStatusEnum)),
        evidence_photo_path: Joi.string,
    }); 
}