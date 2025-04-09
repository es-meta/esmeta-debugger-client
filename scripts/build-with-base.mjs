import { execSync } from 'child_process';
import { argv } from 'process';

async function main() { 
  const base = argv[2] || err('Argument not given');    
  if (!base.startsWith('/')) {
    err('Base must start with slash(/)')
  }
  execSync(`tsc -b`, { stdio: 'inherit' });
  execSync(`vite build --base=${base}`, { stdio: 'inherit' });
}

await main();

/** auxiliaries */
function err(msg) {
  throw new Error(msg);
}