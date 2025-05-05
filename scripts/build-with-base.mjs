import { execSync } from 'child_process';
import { argv } from 'process';

async function main() { 
  const base = argv[2] || err('Argument not given');    
  if (argv[3]) {
    err('Too many arguments');
  }
  if (!base.startsWith('/')) {
    err('Base must start with slash(/)')
  }
  execSync(`tsc -b`, { stdio: 'inherit' });

  console.log(`Building with base: ${base}`);
  console.log(`Given ESMETA_CLIENT_WORKER_AS_DEFAULT: ${process.env.ESMETA_CLIENT_WORKER_AS_DEFAULT}`);
  console.log('----------------------------------');
  console.log('Building with Vite...');

  execSync(`vite build --base=${base}`, { stdio: 'inherit' });
}

await main();

/** auxiliaries */
function err(msg) {
  throw new Error(msg);
}