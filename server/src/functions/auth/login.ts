import { userPrisma } from "../../../prisma/clients.js";
import { compareSync } from "bcrypt";
import HttpError from "../../types/HttpError.js";
import { randomBytes } from "crypto";

export default async function login(data: { email: string, password: string }) {
    let { email, password } = data;

    let user = await userPrisma.findUnique({
        where: {
            email
        }
    });
    if (!user)
        throw new HttpError(404, "Email tidak terdaftar.");
    if (!compareSync(password, user.password))
        throw new HttpError(401, "Password salah.");

    // TODO:
    // Implement automated email, but do it later, we don't need this complexity for now
    // Use "otp" in response instead for OTP testing

    // Generate OTP
    const otp = randomBytes(32).toString("hex");
    await userPrisma.update({
        where: {
            id: user.id
        },
        data: {
            otp
        }
    });

    return {
        message: "Login sukses! Mohon periksa email Anda.",
        otp
    }
}