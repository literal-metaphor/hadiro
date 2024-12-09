import Joi from "joi";

export default function schema() {
    return Joi.object({
        page: Joi.number(),

        grade: Joi.string(),
        class_code: Joi.string(),
        department: Joi.string(),
    }); 
}