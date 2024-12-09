import { Request, Response } from "express";
import HttpError from "./errors/HttpError.js";
import xss from "xss";
import authJwt from "./authJwt.js";

// UNUSED
// export const ALLOWED_ACTIONS = [
//     "auth/login",
//     "auth/otp",

//     "attendance/stats",
//     "attendance/paginate",

//     "student/paginate",
//     "student/create",
//     "student/show",
//     "student/update",
//     "student/destroy",

//     "face/findClosestMatches"
// ] as const;
// type AllowedActions = typeof ALLOWED_ACTIONS[number];

/**
* Handles an incoming request and routes it to the appropriate action.
*
* @param req - The incoming request object.
* @param res - The outgoing response object.
* @param action - The name of the action to be executed.
* @param guarded - Optional. Whether the action requires JWT authentication. Defaults to false.
* @param level - Optional. The level of authentication required for the action. Only applicable if `guarded` is true.
* @throws {HttpError} If the request fails validation or if there is an error during the execution of the API function.
* @returns {Promise<Response<any, Record<string, any>>>} A promise that resolves when the response is sent.
*/
export default async function reqHandler(req: Request, res: Response, action: string, guarded: boolean = false, level?: number): Promise<Response<any, Record<string, any>>> {
    try {
        // Guard protected endpoints with JWT
        if (guarded) await authJwt(req.headers.authorization, level);

        // Validate input according to schema
        const schema = await import(`./schemas/${action}.js`);
        let validation = schema.default().validate({...req.body, ...req.params, ...req.query});
        if (validation.error)
            throw new HttpError(422, validation.error.message);

        // Prevent XSS for all strings in the body
        tranverseBody(validation.value, (str) => xss(str));
        
        // Call the API function
        const func = await import(`../functions/${action}.js`);
        const result = await func.default(validation.value);

        // Return the result
        return res.status(200).json(result);
    } catch (e) {
        if (e instanceof HttpError)
            return res.status(e.statusCode).json({ error: e.message });
    
        return res.status(500).json({ error: "Kesalahan server, mohon coba lagi.",
            stack: e // !PLEASE COMMENT THIS ON PRODUCTION
        });
    }
}

// Use this for testing
export async function mockReqHandler(data: any, action: AllowedActions) {
    try {
        // Validate input according to schema
        const schema = await import(`./schemas/${action}.js`);
        let validation = schema.default().validate(data);
        if (validation.error)
            throw new HttpError(422, validation.error.message);

        // Prevent XSS for all strings in the body
        tranverseBody(validation.value, (str) => xss(str));
        
        // Call the API function
        const func = await import(`../functions/${action}.js`);
        const result = await func.default(validation.value);

        // Return the result
        return result;
    } catch (e) {
        return {
            error: (e as Error).message,
            trace: e
        }
    }
}

function tranverseBody(obj: any, func: (str: string) => string) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // If the val is a string, call the func
            if (typeof obj[key] === 'string')
                obj[key] = func(obj[key]);

            // If the obj[key] is an object, recurse into it
            else if (typeof obj[key] === 'object')
                tranverseBody(obj[key], func);
        }
    }
}