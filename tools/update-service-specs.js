const fs = require('fs');
const path = require('path');

function updateServiceSpecFile(filePath) {
  const backupPath = filePath + '.bak';

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }

  const fileName = path.basename(filePath).replace('.spec.ts', '');
  const className = fileName
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
    .replace('Service', 'Service');

  const content = `
    import { TestBed } from '@angular/core/testing';
    import { ${className} } from './${fileName}';
    import { commonTestsModules } from 'src/test/test-utils';

    describe('${className}', () => {
    let service: ${className};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [${className}],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(${className});
    });

    it('should be created', () => {
            expect(service).toBeTruthy();
        });
        });
    `.trim();

  fs.writeFileSync(filePath, content);
  console.log(`✅ Actualizado: ${filePath}`);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name.endsWith('.service.spec.ts')) {
      updateServiceSpecFile(fullPath);
    }
  }
}

walk(path.join(__dirname, '../src'));