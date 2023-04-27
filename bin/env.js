import chalk from 'chalk';
import {program} from 'commander';
import * as android from './android.js';
import * as ios from './ios.js';

program.option('-t, --tenant <name>', 'Tenant name');

program.parse(process.argv);
const opts = program.opts();
let {tenant} = opts;

if (!tenant) {
  console.log('error: Tenant name is required. Example -t drc');
  process.exit(1);
}

console.log({tenant});

// theme.setup(tenant);
android.setup(tenant);
ios.setup(tenant);

console.log(chalk.green('[MultiTenant] => ' + chalk.blue.yellowBright(tenant)));

program.version('1.0.0');
