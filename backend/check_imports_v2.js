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
    // Simple check for imports that aren't commented out
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('import ') && line.includes(' from ')) {
            const match = line.match(/from ['"](\.\.?\/[^'"]+)['"]/);
            if (match) {
                const importPath = match[1];
                const resolvedPath = path.resolve(path.dirname(filePath), importPath);
                if (!fs.existsSync(resolvedPath)) {
                    // Check for potential folder with index.js or missing extension
                    if (fs.existsSync(resolvedPath + '.js')) {
                        console.log(`MISSING EXTENSION in ${filePath}:${i + 1}: ${importPath} -> should be ${importPath}.js`);
                    } else if (fs.existsSync(path.join(resolvedPath, 'index.js'))) {
                        console.log(`INDEX MISSING in ${filePath}:${i + 1}: ${importPath} -> needs /index.js or folder/index.js`);
                    } else {
                        console.log(`NOT FOUND in ${filePath}:${i + 1}: ${importPath}`);
                    }
                }
            }
        }
    }
}

checkDirectory('src');
