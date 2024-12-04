import { userPrisma } from "../../../prisma/clients.js";
import { compareSync } from "bcrypt";
import HttpError from "../../types/HttpError.js";
import { randomBytes } from "crypto";

export default async function login(data: { email: string, password: string }): Promise<{ message: string; link: string; }> {
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
    // Implement automated email at the last, we don't need this for now
    // Use "link" in response instead for OTP testing

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
        link: `http://localhost:${process.env.PORT || 3000}/api/v1/users/auth/otp?otp=${otp}`
    }
}