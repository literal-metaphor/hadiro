import { expect } from "expect"
import chalk from "chalk";
import { mockReqHandler } from "../utils/reqHandler.js";

// * NOTE: Please seed the database first for the mock data to be ready. ``prisma/seed.ts``

class QuickStatsTest {
    public async run() {
        await this.happyPath(new Date("2024-11-30"), new Date("2024-12-01"));
    
        console.log(chalk.green("All tests passed!"))
    }

    public async happyPath(from: Date, until: Date) {
        try {
            const res = await mockReqHandler({
                from,
                until
            }, "attendance/quickStats");
    
            console.log(chalk.green(`[HAPPY PATH Quick Stats] success: \n${JSON.stringify(res)}\n`));
        } catch (err) {
            console.log(chalk.red(`[HAPPY PATH Quick Stats] caught an error: \n${err}\n`));
        }
    }

    // public async error(name: string, email: string, password: string) {
    //     try {
    //         const res = await mockReqHandler({
    //             email,
    //             password
    //         }, "auth/login");
            
    //         console.log(chalk.red(`[EDGE CASE Login: ${name}] edge case doesn't throw error! \n${res}\n`));
    //     } catch (err) {
    //         console.log(chalk.green(`[EDGE CASE Login: ${name}] caught an error: \n${err}\n`));
    //     }
    // }
    
}

const test = new QuickStatsTest();
await test.run();