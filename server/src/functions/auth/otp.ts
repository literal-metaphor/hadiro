import jwt from "jsonwebtoken";
import { userPrisma } from "../../../prisma/clients.js";
import HttpError from "../../types/HttpError.js";

export default async function otp(data: { otp: string, }) {
    const { otp  } = data;

    const user = await userPrisma.findUnique({
        where: {
            otp
        }
    });
    if (!user)
        throw new HttpError(401, "Kode OTP tidak valid.");

    // Sign a JWT
    if (!process.env.JWT_SECRET)
        throw new HttpError(500, "Service OTP sedang tidak bisa digunakan.");
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return {
        token
    }

    // * I think the user should be redirected back into the dashboard, but I'll need to collaborate with Jason for that
}