import { Tree } from '@angular-devkit/schematics';

import { readJson, writeJson } from './json';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

const dependencies = {
  '@capacitor-community/sqlite': '^8.1.0',
  '@capacitor/core': '^8.4.0',
  'reflect-metadata': '^0.2.2',
  'sql.js': '^1.10.3',
  typeorm: '^1.0.0',
} as const;

const devDependencies = {
  '@types/sql.js': '^1.4.9',
} as const;

export function updatePackageJson(tree: Tree): void {
  const packageJson = readJson<PackageJson>(tree, 'package.json');

  packageJson.dependencies = {
    ...dependencies,
    ...(packageJson.dependencies ?? {}),
  };
  packageJson.devDependencies = {
    ...devDependencies,
    ...(packageJson.devDependencies ?? {}),
  };
  packageJson.scripts = {
    ...(packageJson.scripts ?? {}),
    'typeorm:patch':
      packageJson.scripts?.['typeorm:patch'] ?? 'node ./scripts/modify-typeorm.cjs',
    'build:native':
      packageJson.scripts?.['build:native'] ??
      'ng build --configuration production,native',
    'cap:sync':
      packageJson.scripts?.['cap:sync'] ?? 'npm run build:native && npx cap sync',
    'cap:android':
      packageJson.scripts?.['cap:android'] ??
      'npm run build:native && npx cap sync android',
  };

  packageJson.scripts.postinstall = appendScript(
    packageJson.scripts.postinstall,
    'npm run typeorm:patch',
  );

  writeJson(tree, 'package.json', packageJson);
}

function appendScript(current: string | undefined, command: string): string {
  if (!current) {
    return command;
  }

  if (current.includes(command)) {
    return current;
  }

  return `${current} && ${command}`;
}
