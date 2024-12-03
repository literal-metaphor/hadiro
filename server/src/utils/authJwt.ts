// import jwt from "jsonwebtoken";
// import HttpError from "../types/HttpError";
// import validator from "validator";

// /**
//  * Verify the JWT
//  * @param token JWT to authenticate
//  */
// export default function authJwt(token: string) {
//     if (!process.env.JWT_SECRET)
//         throw new HttpError(500, "Autentikasi server sedang tidak bisa digunakan.");

//     if (!validator.isJWT(token))
//         throw new HttpError(400, "Struktur JWT tidak valid.");

//     let id = "";
//     jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
//         // * FYI: There's no token expiry

//         // Make sure that the user really exist
//         const check = await userPrisma.findUnique({
//           where: {
//             id: (user as jwt.JwtPayload).id,
//           }
//         });

//         if (!check) throw new HttpError(404, "User tidak ditemukan.");

//         // Return user ID
//         id = (user as jwt.JwtPayload).id;
//     });
  
//     return id;
// }