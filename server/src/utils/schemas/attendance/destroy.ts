import Joi from "joi";

export default function schema() {
    return Joi.object({
        id: Joi.string()
        .required()
        ,
    }); 
}