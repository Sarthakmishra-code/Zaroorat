import fs from 'fs';
import path from 'path';

function checkDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                checkDirectory(fullPath);
            }
        } else if (file.endsWith('.js')) {
            checkFile(fullPath);
        }
    }
}

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Match both import and export ... from statements
    const importRegex = /(?:await\s+)?import\s+.*?\s+from\s+['"](.*?)['"]|export\s+.*?\s+from\s+['"](.*?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1] || match[2];
        if (importPath.startsWith('.')) {
            const resolvedPath = path.resolve(path.dirname(filePath), importPath);
            const possibleExtensions = ['.js', '.json'];
            let found = fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile();

            if (!found) {
                for (const ext of possibleExtensions) {
                    if (fs.existsSync(resolvedPath + ext)) {
                        console.log(`MISSING EXTENSION in ${filePath}: "${importPath}" -> should probably be "${importPath}${ext}"`);
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                // Check if it's a directory with index.js
                if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
                    if (fs.existsSync(path.join(resolvedPath, 'index.js'))) {
                        console.log(`DIRECTORY IMPORT in ${filePath}: "${importPath}" -> needs "/index.js"`);
                        found = true;
                    }
                }
            }

            if (!found) {
                console.log(`NOT FOUND in ${filePath}: "${importPath}" (Resolved to: ${resolvedPath})`);
            }
        }
    }
}

console.log("Checking imports in src...");
checkDirectory('src');
