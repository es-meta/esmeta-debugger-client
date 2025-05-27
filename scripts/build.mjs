const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

async function main() { 
  console.log(RED + '[ERROR] script `build` is not supported.' + RESET);
  console.log('Use', GREEN + '`npm run start`' + RESET,  'to run immediately.');
  console.log('Use',YELLOW + '`npm run build:root`' + RESET, 'or',YELLOW + '`npm run build:base`' + RESET, 'to generate a bundle for deployment.');
}

await main();
