import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const rootDir = path.join(__dirname, '..');

async function deploy() {
  console.log('Copying dist files to root...');

  try {
    const files = fs.readdirSync(distDir);
    for (const file of files) {
      const srcPath = path.join(distDir, file);
      const destPath = path.join(rootDir, file);

      if (fs.lstatSync(srcPath).isDirectory()) {
        if (fs.existsSync(destPath)) {
          fs.rmSync(destPath, { recursive: true, force: true });
        }
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
        
        // Critical: Remove iPhone-breaking scripts from index.html
        if (file === 'index.html') {
          let content = fs.readFileSync(destPath, 'utf8');
          
          // Remove import.meta.resolve check
          content = content.replace(/<script type="module">import'data:text\/javascript,if\(!import\.meta\.resolve\)throw Error\("import\.meta\.resolve not supported"\)';.*?window\.__vite_is_modern_browser=true<\/script>/g, 
            '<script type="module">window.__vite_is_modern_browser=true</script>');
          
          // Fix favicon 404
          content = content.replace(/href="\/Cambodia-VVIP-Medical-Platform-Architecture\/vite\.svg"/g, 
            'href="https://rudwls1229-pixel.github.io/Cambodia-VVIP-Medical-Platform-Architecture/vite.svg"');

          fs.writeFileSync(destPath, content);
          console.log('iPhone Black Screen fix applied to index.html');
        }
      }
    }
    console.log('Successfully moved build files to root with iPhone fixes.');
  } catch (error) {
    console.error('Error during deployment:', error);
  }
}

deploy();
