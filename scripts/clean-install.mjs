import { execSync } from 'child_process';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';

const root = join(import.meta.dirname, '..');

// Remove node_modules
const nm = join(root, 'node_modules');
if (existsSync(nm)) {
  console.log('Removing node_modules...');
  rmSync(nm, { recursive: true, force: true });
  console.log('Removed node_modules');
} else {
  console.log('No node_modules found');
}

// Remove lockfiles
for (const f of ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']) {
  const p = join(root, f);
  if (existsSync(p)) {
    console.log(`Removing ${f}...`);
    rmSync(p, { force: true });
    console.log(`Removed ${f}`);
  }
}

// Run fresh install
console.log('Running npm install --legacy-peer-deps...');
try {
  const output = execSync('npm install --legacy-peer-deps', { cwd: root, stdio: 'pipe', encoding: 'utf-8' });
  console.log(output);
  console.log('Install complete!');
} catch (e) {
  console.error('Install failed:', e.stdout || '', e.stderr || '');
  process.exit(1);
}
