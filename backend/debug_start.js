import { spawn } from 'child_process';

const child = spawn('node', ['src/index.js'], { cwd: process.cwd() });

child.stdout.on('data', (data) => {
    console.log(`STDOUT: ${data}`);
});

child.stderr.on('data', (data) => {
    console.error(`STDERR: ${data}`);
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
