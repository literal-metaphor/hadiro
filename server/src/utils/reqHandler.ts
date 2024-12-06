import { Request, Response } from "express";
import HttpError from "../types/HttpError.js";
import xss from "xss";

const ALLOWED_ACTIONS = [
    "auth/login",
    "auth/otp",

    "attendance/stats"
] as const;
type AllowedActions = typeof ALLOWED_ACTIONS[number];

export default async function reqHandler(req: Request, res: Response, action: AllowedActions): Promise<Response<any, Record<string, any>>> {
    try {
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
    
        return res.status(500).json({ error: "Kesalahan server, mohon coba lagi.", stack: e });
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
        throw e;
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