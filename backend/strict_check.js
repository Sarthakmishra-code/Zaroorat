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
    const importRegex = /(?:await\s+)?import\s+.*?\s+from\s+['"](.*?)['"]|export\s+.*?\s+from\s+['"](.*?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1] || match[2];
        if (importPath.startsWith('.')) {
            const dirOfFile = path.dirname(filePath);
            const targetPath = path.join(dirOfFile, importPath);

            // Strict existence check
            if (!fs.existsSync(targetPath)) {
                console.log(`[STRICT ERROR] In ${filePath}: Cannot find "${importPath}" (Looked at ${targetPath})`);
            }
        }
    }
}

console.log("Starting strict import validation...");
checkDirectory('src');
console.log("Validation complete.");
