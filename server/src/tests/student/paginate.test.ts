import { expect } from "expect"
import chalk from "chalk";
import { mockReqHandler } from "../../utils/reqHandler.js";

class StatsTest {
    public async run() {
        await this.happyPath({});
    
        console.log(chalk.green("All tests passed!"));
    }
    
    public async happyPath({
        page,
        grade,
        class_code,
        department,
    }: {
        page?: number,
        grade?: string,
        class_code?: string,
        department?: string,
    }) {
        try {
            const res = await mockReqHandler({
                page,
                grade,
                class_code,
                department
            }, "student/paginate");
    
            console.log(chalk.green(`[HAPPY PATH Paginate] success: \n${JSON.stringify(res)}\n`));
        } catch (err) {
            console.log(chalk.red(`[HAPPY PATH Paginate] caught an error: \n${err}\n`));
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

const test = new StatsTest();
await test.run();