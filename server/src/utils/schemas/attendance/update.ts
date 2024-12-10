import Joi from "joi";

export default function schema() {
    return Joi.object({
        id: Joi.string().required(),
        student_id: Joi.string().required(),
    }); 
}