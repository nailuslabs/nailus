import { rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const target = path.resolve(process.cwd(), 'dist');
rmSync(target, { recursive: true, force: true });
console.log(`Removed ${target}`);
