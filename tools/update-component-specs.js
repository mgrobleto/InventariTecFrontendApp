const fs = require('fs');
const path = require('path');

function updateComponentSpecFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Respaldar el archivo original
  fs.writeFileSync(filePath + '.bak', content, 'utf8');

  let modified = false;

  // Añadir importación si no existe
  if (!content.includes('commonTestsModules')) {
    content = content.replace(
      /(@angular\/core\/testing['"];\s*)/,
      `$1\nimport { commonTestsModules } from 'src/test/test-utils';\n`
    );
    modified = true;
  }

  // Añadir commonTestsModules al bloque de imports si no está
  const testBedRegex = /TestBed\.configureTestingModule\(\s*\{([\s\S]*?)\}\)/;
  const match = content.match(testBedRegex);

  if (match && !match[1].includes('imports')) {
    const updatedConfig = match[0].replace(
      /\{([\s\S]*?)\}/,
      `{
$1,
  imports: [commonTestsModules]
}`
    );
    content = content.replace(testBedRegex, updatedConfig);
    modified = true;
  }

  // Añadir compileComponents si no está
  if (!content.includes('TestBed.compileComponents()')) {
    content = content.replace(
      /TestBed\.configureTestingModule\([^\)]+\);\s*/s,
      (match) => `${match}    await TestBed.compileComponents();\n`
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`➖ No changes needed: ${filePath}`);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDirectory(fullPath);
    } else if (file.endsWith('.component.spec.ts')) {
      updateComponentSpecFile(fullPath);
    }
  }
}

// Ejecutar desde raíz del proyecto
walkDirectory(process.cwd());