import { Tree } from '@angular-devkit/schematics';

import { readJson, writeJson } from './json';

type JsonObject = Record<string, unknown>;

const sqlWasmAsset = {
  glob: 'sql-wasm.wasm',
  input: 'node_modules/sql.js/dist',
  output: '/assets',
};

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

  options['assets'] = addUniqueObject(
    ensureArray(options['assets']),
    sqlWasmAsset,
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
