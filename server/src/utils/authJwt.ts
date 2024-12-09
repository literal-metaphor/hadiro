import jwt from "jsonwebtoken";
import HttpError from "./errors/HttpError.js";
// import { userPrisma } from "../../prisma/clients.js";

/**
 * Verify the JWT
 * @param token JWT to authenticate
 */
export default function authJwt(token?: string) {
  if (!process.env.JWT_SECRET)
    throw new HttpError(500, "Autentikasi server sedang tidak bisa digunakan.");
  if (!token)
    throw new HttpError(403, "Akses endpoint harus menggunakan token");

  jwt.verify(token, process.env.JWT_SECRET,
    // async (err, user) => {
    //   if (err) throw new HttpError(500, "Kesalahan autentikasi server. Mohon coba lagi nanti.");

    //   // Make sure that the user really exist
    //   const id = (user as jwt.JwtPayload).id;
    //   if (!id) throw new HttpError(500, "JWT tidak valid.")
    //   if (!(await userPrisma.findUnique({
    //     where: {
    //       id,
    //     }
    //   }))) throw new HttpError(404, "JWT tidak valid.");
    // }
  );
}