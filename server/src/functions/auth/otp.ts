import jwt from "jsonwebtoken";
import { userPrisma } from "../../../prisma/clients.js";
import HttpError from "../../utils/errors/HttpError.js";
import { compareSync } from "bcrypt";

export default async function otp(body: { email: string, otp: string, }) {
    const { email, otp } = body;

    const user = await userPrisma.findUnique({
        where: {
            email
        }
    });
    if (!user)
        throw new HttpError(401, "Email tidak terdaftar.");

    // Confirm OTP
    if (!user.otp || !compareSync(otp, user.otp))
        throw new HttpError(401, "OTP tidak valid.");

    // Sign a JWT
    if (!process.env.JWT_SECRET)
        throw new HttpError(500, "Service OTP sedang tidak bisa digunakan.");
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return {
        token
    }

    // * I think the user should be redirected back into the dashboard, but I'll need to collaborate with Jason for that
}