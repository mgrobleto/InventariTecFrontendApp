const fs = require('fs');
const path = require('path');

function revertSpecFile(filePath) {
  const backupPath = filePath + '.bak';

  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, filePath);
    console.log(`🔄 Revertido: ${filePath}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name.endsWith('.spec.ts.bak')) {
      const originalFile = fullPath.replace(/\.bak$/, '');
      revertSpecFile(originalFile);
    }
  }
}

// Ejecutar desde src
walk(path.join(__dirname, '../src'));