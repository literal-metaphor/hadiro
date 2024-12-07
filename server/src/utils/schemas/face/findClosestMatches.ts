import Joi from "joi";

export default function schema() {
    return Joi.object({
        descriptor: Joi.array()
            .required(),
    });
}