import Joi from "joi";

export default function schema() {
    return Joi.object({
        file_base64: Joi.string()
            .base64()
            .required()
    }); 
}