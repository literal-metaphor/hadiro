import Joi from "joi";

export default function schema() {
    return Joi.object({
        student_id: Joi.string().required()
    }); 
}