import Joi from "joi";
import { InattendanceReasonEnum } from "../../enums/InattendanceReason.js";

export default function schema() {
    return Joi.object({
        student_id: Joi.string().required(),
        reason: Joi.string().required().valid(...Object.keys(InattendanceReasonEnum)),
        evidence_photo_path: Joi.string().required(),
    }); 
}