import Joi from "joi";

export default function schema() {
    return Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: true } })
            .required(),
            // .messages({
            //     'string.base': `Email harus dalam bentuk string.`,
            //     'string.empty': `Email tidak boleh kosong.`,
            //     'string.email': `Email tidak valid.`,
            //     'any.required': `Email harus diisi.`
            // }),

        otp: Joi.string()
            .required()
            // .messages({
            //     'string.base': `OTP harus dalam bentuk string.`,
            //     'string.empty': `OTP tidak boleh kosong.`,
            //     'any.required': `OTP harus diisi.`
            // }),
    });
}