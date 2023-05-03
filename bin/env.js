import chalk from 'chalk';
import {program} from 'commander';

import fs from 'fs';
import path from 'path';

program.option('-t, --tenant <name>', 'Tenant name');

program.parse(process.argv);
const opts = program.opts();
let {tenant} = opts;

if (!tenant) {
  console.log('error: Tenant name is required. Example -t drc');
  process.exit(1);
}

(async () => {
  await android();
  await ios();
})();

console.log(
  chalk.green(
    '[MultiTenant] => App renamed to: ' + chalk.blue.yellowBright(tenant),
  ),
);

program.version('1.0.0');

async function android() {
  console.log(
    chalk.green(
      '[MultiTenant] => Iniciando Android: ' + chalk.blue.yellowBright(tenant),
    ),
  );
  const sourceAssetsDir = path.join(
    __dirname,
    '..',
    'configs',
    tenant,
    'android',
  );
  const targetAssetsDir = path.join(__dirname, '..', 'android');
  fs.copySync(sourceAssetsDir, targetAssetsDir);
  console.log(
    chalk.green(
      '[MultiTenant] => Android Moved: ' + chalk.blue.yellowBright(tenant),
    ),
  );
}

async function ios() {
  console.log(
    chalk.green(
      '[MultiTenant] => Iniciando IOS: ' + chalk.blue.yellowBright(tenant),
    ),
  );
  const sourceAssetsDir = path.join(__dirname, '..', 'configs', tenant, 'ios');
  const targetAssetsDir = path.join(__dirname, '..', 'ios');
  fs.copySync(sourceAssetsDir, targetAssetsDir);
  console.log(
    chalk.green(
      '[MultiTenant] => IOS Moved: ' + chalk.blue.yellowBright(tenant),
    ),
  );
}
