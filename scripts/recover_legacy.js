import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const versions = [
  { tag: 'v1.3.0', commit: 'ddc4cd73f624d6536ce0a969430330de0c8c9942', files: ['the-seoul-private-v1.3.0.html', 'the-seoul-private-v1.3.0.htm'] },
  { tag: 'v1.2.9', commit: 'd3f634b936bfeb133d7975e2f300db770349aee0', files: ['the-seoul-private-v1.2.9.html', 'the-seoul-private-v1.2.9.htm'] },
  { tag: 'v1.2.8', commit: '38ed4856a7068b02f92e3a6265275a5dd4513de3', files: ['the-seoul-private-v1.2.8.html', 'the-seoul-private-v1.2.8.htm'] },
  { tag: 'v1.2.7', commit: '2bd618851bacfd1e43f18c45a2d81d894855bd56', files: ['the-seoul-private-v1.2.7.html', 'the-seoul-private-v1.2.7.htm'] },
  { tag: 'v1.2.6', commit: '1453e6ecaf5b0f271b989a5fe4cfc3b8828ff801', files: ['the-seoul-private-v1.2.6.html', 'the-seoul-private-v1.2.6.htm'] },
  { tag: 'v1.2.5', commit: 'e901e74b51cf3508d6c0815337df088d6ff01cba', files: ['the-seoul-private-v1.2.5.html', 'the-seoul-private-v1.2.5.htm'] },
  { tag: 'v1.2.4', commit: '24af9108fa3f15475ddfa0055406dc2ea61374a3', files: ['the-seoul-private-v1.2.4.html', 'the-seoul-private-v1.2.4.htm'] },
  { tag: 'v1.2.3', commit: 'a7928c2d69f0034059fd22a00e75395abf6ba6e7', files: ['the-seoul-private-v1.2.3.html', 'the-seoul-private-v1.2.3.htm'] },
  { tag: 'v1.2.2', commit: '3fa17c5dcdf5074b195cc64fa9ba7f788e236ad0', files: ['the-seoul-private-v1.2.2.html', 'the-seoul-private-v1.2.2.htm'] },
  { tag: 'v1.2.1', commit: 'f968c0108560d7f5b550e0c2870e734691576efa', files: ['the-seoul-private-v1.2.1.html'] },
  { tag: 'v1.2.0', commit: '3dda34495ce4bed3f889d224746eecdd0025e007', files: ['the-seoul-private-v1.2.0.html'] },
  { tag: 'v1.1.9', commit: '398fd473964439fe1a58090504becf5c48eef286', files: ['the-seoul-private-v1.1.9.html'] },
  { tag: 'v1.1.8', commit: '4daaa9f125a3279308460c2c80bc38f1ac7a97e6', files: ['the-seoul-private-v1.1.8.html'] },
  { tag: 'v1.1.7', commit: 'e3bedbf8f8b50a46b297ba96aaf96c3bc9cc9b69', files: ['the-seoul-private-v1.1.7.html'] }
];

const targetDir = 'archives/legacy_versions';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

versions.forEach(v => {
  v.files.forEach(file => {
    try {
      console.log(`Recovering ${file} from commit ${v.commit}...`);
      const fullPath = `dist/${file}`;
      execSync(`git checkout ${v.commit} -- ${fullPath}`, { stdio: 'ignore' });
      if (fs.existsSync(fullPath)) {
        fs.copyFileSync(fullPath, path.join(targetDir, file));
        // Clean up the file from dist so we don't mess up current state
        execSync(`git checkout HEAD -- ${fullPath}`, { stdio: 'ignore' });
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    } catch (e) {
      console.error(`Failed to recover ${file}: ${e.message}`);
    }
  });
});

console.log('Recovery complete. Files are in archives/legacy_versions');
