import Joi from "joi";

export default function schema() {
    return Joi.object({
        from: Joi.date()
            .required(),
    
        until: Joi.date()
            .required()
    });
}