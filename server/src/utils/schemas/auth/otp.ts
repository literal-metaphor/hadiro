import Joi from "joi";

export default function schema() {
    return Joi.object({
        otp: Joi.string()
            .required()
            .messages({
                'string.base': `OTP harus dalam bentuk string.`,
                'string.empty': `OTP tidak boleh kosong.`,
                'any.required': `OTP harus diisi.`
            }),
    });
}