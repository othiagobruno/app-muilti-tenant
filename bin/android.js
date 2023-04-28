import fs from 'fs';
import path from 'path';
import {getConfig} from './config.js';
import {fileURLToPath} from 'url';
import { tenants } from '../configs/tenants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function setup(tenant) {
  tenant = tenant.toLowerCase();

  manifest(tenant);
  strings(tenant);
  firebase(tenant);
  icon(tenant);
  splash(tenant);
  clean();
}

function firebase(tenant) {
  const configFilePath = path.join(
    __dirname,
    '..',
    'configs',
    tenant,
    'android',
    'google-services.json',
  );
  if (!fs.existsSync(configFilePath)) {
    console.error(`Firebase config file not found in ${configFilePath}.`);
  }

  const configDestFilePath = path.join(
    __dirname,
    '..',
    'android',
    'app',
    'google-services.json',
  );
  fs.copyFileSync(configFilePath, configDestFilePath);
}

function icon(tenant) {
  const iconConfigPath = path.join(
    __dirname,
    '..',
    'android',
    'app',
    'src',
    'main',
    'AndroidManifest.xml',
  );

  let iconConfigFileContent = fs.readFileSync(iconConfigPath, {
    encoding: 'utf-8',
  });
  iconConfigFileContent = iconConfigFileContent.replace(
    /android:icon=.*/,
    `android:icon="@mipmap/ic_launcher_${tenant}"`,
  );
  iconConfigFileContent = iconConfigFileContent.replace(
    /android:roundIcon=.*/,
    `android:roundIcon="@mipmap/ic_launcher_rounded_${tenant}"`,
  );
  fs.writeFileSync(iconConfigPath, iconConfigFileContent, {
    encoding: 'utf-8',
  });
}

function splash(tenant) {
  const splashConfigPath = path.join(
    __dirname,
    '..',
    'android',
    'app',
    'src',
    'main',
    'res',
    'values',
    'styles.xml',
  );
  let splashConfigFileContent = fs.readFileSync(splashConfigPath, {
    encoding: 'utf-8',
  });
  
  splashConfigFileContent = splashConfigFileContent.replace(
    /@drawable.*/,
    `@drawable/bg_splashscreen_${tenant}`,
  );

  splashConfigFileContent = splashConfigFileContent.replace(
    /@drawable.*/,
    `@drawable/bg_splashscreen_${tenant}`,
  );

  fs.writeFileSync(splashConfigPath, splashConfigFileContent, {
    encoding: 'utf-8',
  });
}

function strings(tenant) {
  const stringsConfigPath = path.join(
    __dirname,
    '..',
    'android',
    'app',
    'src',
    'main',
    'res',
    'values',
    'strings.xml',
  );
  
  let stringFileContent = fs.readFileSync(stringsConfigPath, {
    encoding: 'utf-8',
  });

  stringFileContent = stringFileContent.replace(
    /<string name="app_name">.*/,
    `<string name="app_name">${getConfig(tenant).name}</string>`,
  );
  
  stringFileContent = stringFileContent.replace(
    /<string moduleConfig="true" name="CodePushDeploymentKey">.*/,
    `<string moduleConfig="true" name="CodePushDeploymentKey">${
      getConfig(tenant).codepush_android_production_key
    }</string>`,
  );
  
  fs.writeFileSync(stringsConfigPath, stringFileContent, {
    encoding: 'utf-8',
  });
}

function manifest(tenant) {
  const app = getConfig(tenant);

  const stringsConfigPath = path.join(
    __dirname,
    '..',
    'android',
    'app',
    'src',
    'main',
    'AndroidManifest.xml',
  );
  let manifestFileContent = fs.readFileSync(stringsConfigPath, {
    encoding: 'utf-8',
  });

  manifestFileContent = manifestFileContent.replace(
    /<data android:pathPrefix.*/,
    `<data android:pathPrefix="/android/callback" android:scheme="${app.uri}" android:host="${app.uri}" />`,
  );
  fs.writeFileSync(stringsConfigPath, manifestFileContent, {
    encoding: 'utf-8',
  });
}

function clean() {
  const buildPath = path.join(__dirname, '..', 'android', 'app', 'build');

  if (fs.existsSync(buildPath)) {
    fs.rmdirSync(buildPath, {
      recursive: true,
    });
  }
}

export {setup};
