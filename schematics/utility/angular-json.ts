import { Tree } from '@angular-devkit/schematics';

import { readJson, writeJson } from './json';

type JsonObject = Record<string, unknown>;

const sqlWasmAssets = [
  {
    glob: 'sql-wasm*.wasm',
    input: 'node_modules/sql.js/dist',
    output: '/assets',
  },
  {
    glob: 'sql-wasm*.wasm',
    input: '../node_modules/sql.js/dist',
    output: '/assets',
  },
  {
    glob: 'sql-wasm*.wasm',
    input: '../../node_modules/sql.js/dist',
    output: '/assets',
  },
] as const;

const publicAsset = {
  glob: '**/*',
  input: 'public',
};

const commonJsDependencies = ['reflect-metadata', 'sql.js', 'typeorm/browser'];

export function updateAngularJson(tree: Tree, projectName: string): void {
  const workspace = readJson<JsonObject>(tree, 'angular.json');
  const projects = workspace['projects'] as JsonObject | undefined;
  const project = projects?.[projectName] as JsonObject | undefined;

  if (!project) {
    throw new Error(`Angular project not found: ${projectName}`);
  }

  const targets = (project['architect'] ?? project['targets']) as
    | JsonObject
    | undefined;
  const build = targets?.['build'] as JsonObject | undefined;
  const options = build?.['options'] as JsonObject | undefined;

  if (!options) {
    throw new Error(`Build options not found for Angular project: ${projectName}`);
  }

  options['assets'] = addUniqueObjects(
    normalizeSqlWasmAssets(ensureArray(options['assets'])),
    sqlWasmAssets,
  );
  options['allowedCommonJsDependencies'] = addUniqueValues(
    ensureStringArray(options['allowedCommonJsDependencies']),
    commonJsDependencies,
  );

  if (!build) {
    throw new Error(`Build target not found for Angular project: ${projectName}`);
  }

  const configurations = ensureObject(build, 'configurations');
  const native = ensureObject(configurations, 'native');
  native['assets'] = addUniqueObject(ensureArray(native['assets']), publicAsset);

  writeJson(tree, 'angular.json', workspace);
}

function ensureObject(parent: JsonObject, key: string): JsonObject {
  const value = parent[key];

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as JsonObject;
  }

  const next: JsonObject = {};
  parent[key] = next;
  return next;
}

function ensureArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function ensureStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
}

function addUniqueValues(values: string[], additions: readonly string[]): string[] {
  return [...values, ...additions.filter((value) => !values.includes(value))];
}

function addUniqueObject(values: unknown[], addition: JsonObject): unknown[] {
  const serialized = JSON.stringify(addition);

  if (values.some((value) => JSON.stringify(value) === serialized)) {
    return values;
  }

  return [...values, addition];
}

function addUniqueObjects(
  values: unknown[],
  additions: readonly JsonObject[],
): unknown[] {
  return additions.reduce(
    (nextValues, addition) => addUniqueObject(nextValues, addition),
    values,
  );
}

function normalizeSqlWasmAssets(values: unknown[]): unknown[] {
  return values.map((value) => {
    if (!isJsonObject(value)) {
      return value;
    }

    if (
      value['glob'] === 'sql-wasm.wasm' &&
      typeof value['input'] === 'string' &&
      value['input'].endsWith('node_modules/sql.js/dist') &&
      value['output'] === '/assets'
    ) {
      return {
        ...value,
        glob: 'sql-wasm*.wasm',
      };
    }

    return value;
  });
}

function isJsonObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
