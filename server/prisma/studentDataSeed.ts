import fs from 'fs';
import path from 'path';
import { studentPrisma } from './clients.js';
import { randomUUID } from 'crypto';

/**
 * Recursively reads files from a directory and calls the callback for each .json file found.
 * @param dir - The directory to read files from.
 * @param callback - A function to call for each .json file found.
 */
async function readJsonFiles(dir: string, callback: (filePath: string) => Promise<void>) {
    // Read the contents of the directory
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${dir}:`, err);
            return;
        }

        // Iterate over each file/directory in the current directory
        files.forEach(async file => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
                // If it's a directory, recursively read it
                readJsonFiles(filePath, callback);
            } else if (file.isFile() && file.name.endsWith('.json')) {
                // If it's a .json file, call the callback
                await callback(filePath);
            }
        });
    });
}

// Example usage
const directoryPath = './student_data'; // Change this to your target directory

readJsonFiles(directoryPath, async (filePath) => {
    fs.readFile(filePath, 'utf8', async (err, file) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        try {
            const data = JSON.parse(file) as any;
            data.id = randomUUID();
            data.descriptor = (data.descriptor as Array<number>).join(",");
            await studentPrisma.create({
                data
            });
            console.log(`Success inserting ${data.name}`);
            setTimeout(() => {
                return;
            }, 10);
        } catch (parseError) {
            console.error(`Error parsing JSON from ${filePath}:`, parseError);
            process.exit(1);
        }
    });
});
