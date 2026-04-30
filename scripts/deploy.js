import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const rootDir = path.join(__dirname, '..');

// Files and folders to NEVER delete in root
const keepList = [
  'src', 'public', 'node_modules', 'scripts', 'versions', 
  '.git', '.gemini', '.gitignore', 'package.json', 
  'package-lock.json', 'vite.config.js', 'index.html', 'README.md'
];

async function deploy() {
  console.log('--- v1.9.0 AGGRESSIVE DEPLOYMENT START ---');

  try {
    // 1. Clean root of garbage build files
    console.log('Cleaning root directory of old build files...');
    const rootFiles = fs.readdirSync(rootDir);
    for (const file of rootFiles) {
      if (!keepList.includes(file)) {
        const fullPath = path.join(rootDir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(fullPath);
        }
        console.log(`Deleted: ${file}`);
      }
    }

    // 2. Copy new dist files to root
    console.log('Copying fresh dist files to root...');
    const distFiles = fs.readdirSync(distDir);
    for (const file of distFiles) {
      const srcPath = path.join(distDir, file);
      const destPath = path.join(rootDir, file);

      if (fs.lstatSync(srcPath).isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        // For index.html, we overwrite the template in root
        fs.copyFileSync(srcPath, destPath);
        
        if (file === 'index.html') {
          let content = fs.readFileSync(destPath, 'utf8');
          // Add timestamp to prevent internal script caching
          const timestamp = Date.now();
          content = content.replace(/src="\//g, `src="./`); // Ensure relative paths
          content = content.replace(/href="\//g, `href="./`);
          
          // iPhone Black Screen fix
          content = content.replace(/<script type="module">import'data:text\/javascript,if\(!import\.meta\.resolve\)throw Error\("import\.meta\.resolve not supported"\)';.*?window\.__vite_is_modern_browser=true<\/script>/g, 
            '<script type="module">window.__vite_is_modern_browser=true</script>');

          fs.writeFileSync(destPath, content);
          console.log('iPhone and Cache fixes applied to index.html');
        }
      }
    }
    console.log('Successfully deployed v1.9.0 to root.');
  } catch (error) {
    console.error('CRITICAL DEPLOYMENT FAILURE:', error);
    process.exit(1);
  }
}

deploy();
