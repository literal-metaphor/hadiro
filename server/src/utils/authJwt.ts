import jwt from "jsonwebtoken";
import HttpError from "./errors/HttpError.js";
import { userPrisma } from "../../prisma/clients.js";

/**
 * Verify the JWT
 * @param token JWT to authenticate
 */
export default async function authJwt(token?: string, level?: number) {
    try {
        if (!process.env.JWT_SECRET)
            throw new HttpError(500, "Autentikasi server sedang tidak bisa digunakan: process.env.JWT_SECRET not found.");
        if (!level)
            throw new HttpError(500, "Autentikasi server sedang tidak bisa digunakan: level not declared for this endpoint.")
        if (!token)
            throw new HttpError(403, "Akses endpoint harus menggunakan token.");
    
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Make sure that the user really exist and authorized to access endpoint
        const user = await userPrisma.findUnique({
            where: {
                id: (decoded as jwt.JwtPayload).id
            }
        })
        if (!user) throw new HttpError(403, "JWT tidak valid.");
        if (user.level < level) throw new HttpError(403, "Akses endpoint ditolak.")
    } catch (err) {
        throw err;
    }
}