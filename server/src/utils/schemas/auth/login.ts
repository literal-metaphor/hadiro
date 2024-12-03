import Joi from "joi";

export default function schema() {
    return Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: true } })
            .required()
            .messages({
                'string.base': `Email harus dalam bentuk string.`,
                'string.empty': `Email tidak boleh kosong.`,
                'string.email': `Email tidak valid.`,
                'any.required': `Email tidak boleh kosong.`
            }),
    
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,24}$'))
            .required()
            .messages({
                'string.base': `Password harus dalam bentuk string.`,
                'string.empty': `Password tidak boleh kosong.`,
                'string.pattern.base': `Password tidak sesuai dengan pola.`, // 8 to 24 chars, at least one uppercase, lowercase, and number
                'any.required': `Password tidak boleh kosong.`
            }),
    });
}