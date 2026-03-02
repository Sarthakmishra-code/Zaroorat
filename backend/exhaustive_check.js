import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');

function checkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkDir(fullPath);
        } else if (file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
                const trimmedLine = line.trim();
                if ((trimmedLine.startsWith('import ') || trimmedLine.startsWith('export ')) && trimmedLine.includes(' from ')) {
                    const match = line.match(/from ['"](\.?\.\/.*?)['"]/);
                    if (match) {
                        const relPath = match[1];
                        let targetPath = path.resolve(path.dirname(fullPath), relPath);
                        if (!relPath.endsWith('.js') && !relPath.endsWith('.json')) {
                            console.log(`[MISSING EXTENSION] ${fullPath}:${idx + 1} -> ${relPath}`);
                        } else if (!fs.existsSync(targetPath)) {
                            console.log(`[FILE NOT FOUND] ${fullPath}:${idx + 1} -> ${relPath} (Looked at ${targetPath})`);
                        }
                    }
                }
            });
        }
    }
}

console.log("Starting exhaustive check...");
checkDir(srcDir);
console.log("Check complete.");
