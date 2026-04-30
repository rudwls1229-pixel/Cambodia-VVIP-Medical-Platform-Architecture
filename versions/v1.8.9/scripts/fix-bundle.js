import fs from 'fs';
import path from 'path';

const filePath = 'dist/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove type="module" and crossorigin to allow running as a regular script
content = content.replace(/type="module" crossorigin/g, '');
content = content.replace(/crossorigin/g, '');

// 2. Add eruda initialization at the very top of the script if possible
// (Already added in index.html, but let's make sure)

fs.writeFileSync(filePath, content);
console.log('Post-build: Removed type="module" for iOS compatibility.');
