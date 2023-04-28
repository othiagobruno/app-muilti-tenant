import chalk from 'chalk';
import {program} from 'commander';
import * as android from './android.js';
import * as ios from './ios.js';
import { getConfig } from './config.js';
import {exec} from 'child_process';

program.option('-t, --tenant <name>', 'Tenant name');

program.parse(process.argv);
const opts = program.opts();
let {tenant} = opts;

if (!tenant) {
  console.log('error: Tenant name is required. Example -t drc');
  process.exit(1);
}

const app = getConfig(tenant);


// ios.setup(tenant);


const command = `npx react-native-rename "${app.uri}" -b "${app.app_uri_android}"`

console.log(chalk.yellow('[MultiTenant] => RENAME APP'));
exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
  } else {
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  }
});
console.log(chalk.green('[MultiTenant] => RENAME FINISHED'));

//
console.log(chalk.yellow('[MultiTenant] => ANDROID SETUP'));
android.setup(tenant);
console.log(chalk.green('[MultiTenant] => ANDROID FINISHED'));


console.log(chalk.green('[MultiTenant] => App renamed to: ' + chalk.blue.yellowBright(tenant)));

program.version('1.0.0');
