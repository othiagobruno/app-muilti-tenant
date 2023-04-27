import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import plist from 'plist';
import {getConfig} from './config.js';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function setup(tenant = 'drc') {
  tenant = tenant.toLocaleLowerCase();
  // TODO: falta alterar a splash screen
  appname(tenant);
  codepush(tenant);
  firebase(tenant);
  icons(tenant);
}

function appname(tenant) {
  const app = getConfig(tenant);

  const plistPath = path.join(
    __dirname,
    '..',
    'ios',
    'multitenant',
    'Info.plist',
  );

  let plistContent = fs.readFileSync(plistPath, {
    encoding: 'utf-8',
  });

  let plistJson = plist.parse(plistContent);

  plistJson.CFBundleDisplayName = app.title;
  plistJson.CFBundleIdentifier = `${app.app_uri_ios}`;

  const plistContentChanged = plist.build(plistJson);
  fs.writeFileSync(plistPath, plistContentChanged, {
    encoding: 'utf-8',
  });
}

function firebase(tenant) {
  const configFilePath = path.join(
    __dirname,
    '..',
    'configs',
    tenant,
    'ios',
    'GoogleService-Info.plist',
  );
  if (!fs.existsSync(configFilePath)) {
    console.error(`Firebase config file not found in ${configFilePath}.`);
  }

  const configDestFilePath = path.join(
    __dirname,
    '..',
    'ios',
    'GoogleService-Info.plist',
  );
  fs.copyFileSync(configFilePath, configDestFilePath);
}

function codepush(tenant = 'drc') {
  const plistPath = path.join(
    __dirname,
    '..',
    'ios',
    'multitenant',
    'Info.plist',
  );

  let plistContent = fs.readFileSync(plistPath, {
    encoding: 'utf-8',
  });

  let plistJson = plist.parse(plistContent);

  plistJson.CodePushDeploymentKey =
    getConfig(tenant).codepush_ios_production_key;

  const plistContentChanged = plist.build(plistJson);
  fs.writeFileSync(plistPath, plistContentChanged, {
    encoding: 'utf-8',
  });
}

function icons(tenant) {
  const sourceAssetsDir = path.join(
    __dirname,
    '..',
    'configs',
    tenant,
    'ios',
    'Images.xcassets',
    'AppIcon.appiconset',
  );
  const targetAssetsDir = path.join(
    __dirname,
    '..',
    'ios',
    'multitenant',
    'Images.xcassets',
    'AppIcon.appiconset',
  );
  fse.copySync(sourceAssetsDir, targetAssetsDir);
}

export {setup};
