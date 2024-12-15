import Joi from "joi";
import { ViolationReasonEnum } from "../../enums/ViolationReason.js";

export default function schema() {
    return Joi.object({
        student_id: Joi.string().required(),
        reason: Joi.string().required().valid(...Object.keys(ViolationReasonEnum)),
    }); 
}