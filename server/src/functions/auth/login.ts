import { userPrisma } from "../../../prisma/clients.js";
import { compareSync } from "bcrypt";
import HttpError from "../../types/HttpError.js";
import xss from "xss";

export default async function login(body: { email: string, password: string }): Promise<{ message: string; }> {
    let { email, password } = body;
    email = xss(email);
    password = xss(password);

    // Check user existence and password
    let user = await userPrisma.findUnique({
        where: {
            email
        }
    });
    if (!user)
        throw new HttpError(404, "Email tidak terdaftar.");
    if (!compareSync(password, user.password))
        throw new HttpError(401, "Password salah.");

    // TODO: OTP

    return {
        message: "Login sukses! Mohon periksa email Anda."
    }
}