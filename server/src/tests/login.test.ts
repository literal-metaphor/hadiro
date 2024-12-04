import { expect } from "expect"
import login from "../functions/auth/login.js";
import { userPrisma } from "../../prisma/clients.js";
import chalk from "chalk";
import { mockReqHandler } from "../utils/reqHandler.js";

// * NOTE: Please seed the database first for the mock data to be ready. ``/prisma/seed.ts``

class LoginTest {
    public async run() {
        await this.happyPath("user@email.com", "Passw0rd");

        await this.error("email not found", "silly@email.com", "Passw0rd");
        await this.error("wrong password", "user@email.com", "silly password");
        await this.error("email or password not filled", (null as unknown) as string, (null as unknown) as string);
        await this.error("malformed email", "silly looking email", "Passw0rd");
    
        console.log(chalk.green("All tests passed!"))
    }

    // * Valid login:
    public async happyPath(email: string, password: string) {
        try {
            const res = await mockReqHandler({
                email,
                password
            }, "auth/login");
    
            expect(res).toMatchObject({
                message: expect.any(String),
                otp: expect.any(String)
            });
    
            if (!await userPrisma.findUnique({
                where: {
                    otp: res.otp
                }
            })) throw new Error("OTP is invalid!");
    
            console.log(chalk.green(`[HAPPY PATH Login] success: \n${JSON.stringify(res)}\n`));
        } catch (err) {
            console.log(chalk.red(`[HAPPY PATH Login] caught an error: \n${err}\n`));
        }
    }

    public async error(name: string, email: string, password: string) {
        try {
            const res = await mockReqHandler({
                email,
                password
            }, "auth/login");
            
            console.log(chalk.red(`[EDGE CASE Login: ${name}] edge case doesn't throw error! \n${res}\n`));
        } catch (err) {
            console.log(chalk.green(`[EDGE CASE Login: ${name}] caught an error: \n${err}\n`));
        }
    }
    
}

const test = new LoginTest();
await test.run();