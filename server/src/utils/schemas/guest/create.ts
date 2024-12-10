import Joi from "joi";

export default function schema() {
    return Joi.object({
        name: Joi.string().required(),
        instance: Joi.string().required(),
        intention: Joi.string().required(),
        problem: Joi.string().required(),
        phone_number: Joi.string().required(),
        photo_path: Joi.string().required(),
    }); 
}