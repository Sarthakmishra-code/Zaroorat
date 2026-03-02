import fs from 'fs';
import path from 'path';

function checkDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkDirectory(fullPath);
        } else if (file.endsWith('.js')) {
            checkFile(fullPath);
        }
    }
}

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /from ['"](\.\.?\/[^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        const resolvedPath = path.resolve(path.dirname(filePath), importPath);
        let finalPath = resolvedPath;
        if (!fs.existsSync(finalPath)) {
            if (fs.existsSync(finalPath + '.js')) {
                console.log(`MISSING EXTENSION in ${filePath}: ${importPath} should be ${importPath}.js`);
            } else {
                console.log(`NOT FOUND in ${filePath}: ${importPath} points to ${finalPath}`);
            }
        }
    }
}

checkDirectory('src');
