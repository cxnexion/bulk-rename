import fs from 'fs/promises';
import path from 'path';

const [dirPath, fileName] = process.argv.slice(2);

// Check if arguments exist
if (!dirPath || !fileName) {
    console.error(`No argument provided. Usage: npm start path name`)
    process.exit(1);
}

// Check if path exist and accessible
try {
    if (!path.isAbsolute(dirPath) || !fs.access(dirPath)) {
        console.error('Invalid directory path. Please, ensure directory path is right.')
        process.exit(1);
    }
} catch (e) {
    console.error("Can't access directory with given path.")
    process.exit(1);
}

// Check if name is valid
const validNameChars = /^[a-zA-Z0-9._-]+$/;
if (!validNameChars.test(fileName)) {
    console.error('Invalid file name.');
    process.exit(1);
}

//Get full path to every file in directory
const filesToRename = (await fs.readdir(dirPath)).map(name => path.join(dirPath, name));

let successCount = 0;
let index = 1;

// Renaming every file
for (const filePath of filesToRename) {
    try {
        await fs.rename(filePath, path.join(dirPath, fileName + index + path.extname(filePath)));
        index++;
        successCount++;
    } catch (e) {
        console.error(`Failed to rename file ${filePath}`)
        console.error(e)
    }
}

console.log(`Renaming files in directory ${dirPath} to ${fileName} ended. \nTotally files in directory - ${filesToRename.length} \nSuccessfully renamed - ${successCount} \nFailed to rename - ${filesToRename.length - successCount}`);

