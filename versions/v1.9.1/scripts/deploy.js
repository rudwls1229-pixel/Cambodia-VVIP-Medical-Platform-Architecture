import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const rootDir = path.join(__dirname, '..');

const keepList = [
  'src', 'public', 'node_modules', 'scripts', 'versions', 
  '.git', '.gemini', '.gitignore', 'package.json', 
  'package-lock.json', 'vite.config.js', 'index.html', 'README.md'
];

async function deploy() {
  console.log('--- v1.9.1 RELIABILITY DEPLOYMENT START ---');

  try {
    if (!fs.existsSync(distDir)) {
      throw new Error('Dist directory does not exist! Build might have failed.');
    }

    // 1. Clean root (careful cleaning)
    console.log('Cleaning root directory...');
    const rootFiles = fs.readdirSync(rootDir);
    for (const file of rootFiles) {
      if (!keepList.includes(file) && file !== 'assets') {
        const fullPath = path.join(rootDir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(fullPath);
        }
      }
    }

    // 2. Copy dist to root
    console.log('Deploying build artifacts...');
    const distFiles = fs.readdirSync(distDir);
    for (const file of distFiles) {
      const srcPath = path.join(distDir, file);
      const destPath = path.join(rootDir, file);

      if (fs.lstatSync(srcPath).isDirectory()) {
        if (fs.existsSync(destPath)) fs.rmSync(destPath, { recursive: true, force: true });
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
        
        if (file === 'index.html') {
          let content = fs.readFileSync(destPath, 'utf8');
          
          // CRITICAL CHECK: If content contains "/src/main.jsx", it is the WRONG index.html (template)
          if (content.includes('/src/main.jsx')) {
            throw new Error('CRITICAL: deploy.js is attempting to deploy the index.html TEMPLATE instead of the BUILD file.');
          }

          // Apply relative fixes
          content = content.replace(/src="\//g, 'src="./');
          content = content.replace(/href="\//g, 'href="./');
          
          // iPhone fixes
          content = content.replace(/<script type="module">import'data:text\/javascript,if\(!import\.meta\.resolve\)throw Error\("import\.meta\.resolve not supported"\)';.*?window\.__vite_is_modern_browser=true<\/script>/g, 
            '<script type="module">window.__vite_is_modern_browser=true</script>');

          fs.writeFileSync(destPath, content);
          console.log('Verified and patched index.html for production.');
        }
      }
    }
    console.log('v1.9.1 Deployment Successful.');
  } catch (error) {
    console.error('DEPLOYMENT ABORTED:', error.message);
    process.exit(1);
  }
}

deploy();
