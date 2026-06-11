import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { PatchTypeormSchema } from './schema';

interface PatchTarget {
  readonly file: string;
  readonly patch: (source: string, file: string) => string;
}

const targets: PatchTarget[] = [
  {
    file: 'node_modules/typeorm/driver/capacitor/CapacitorQueryRunner.js',
    patch: patchQueryRunner,
  },
  {
    file: 'node_modules/typeorm/browser/driver/capacitor/CapacitorQueryRunner.js',
    patch: patchQueryRunner,
  },
  {
    file: 'node_modules/typeorm/driver/capacitor/CapacitorDriver.js',
    patch: patchDriver,
  },
  {
    file: 'node_modules/typeorm/browser/driver/capacitor/CapacitorDriver.js',
    patch: patchDriver,
  },
  {
    file: 'node_modules/typeorm/driver/expo/ExpoDriver.js',
    patch: patchExpoDriver,
  },
  {
    file: 'node_modules/typeorm/browser/driver/expo/ExpoDriver.js',
    patch: patchExpoDriver,
  },
  {
    file: 'node_modules/typeorm/browser/util/StringUtils.js',
    patch: patchBrowserStringUtils,
  },
  {
    file: 'node_modules/sql.js/dist/sql-wasm.js',
    patch: patchSqlJsBrowserBundle,
  },
];

export function patchTypeorm(_options: PatchTypeormSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    for (const target of targets) {
      patchFile(tree, context, target);
    }

    return tree;
  };
}

function patchFile(
  tree: Tree,
  context: SchematicContext,
  target: PatchTarget,
): void {
  if (!tree.exists(target.file)) {
    context.logger.warn(`TypeORM patch skipped: ${target.file} was not found.`);
    return;
  }

  const current = tree.readText(target.file);
  const next = target.patch(current, target.file);

  if (current === next) {
    context.logger.info(`TypeORM patch already applied: ${target.file}`);
    return;
  }

  tree.overwrite(target.file, next);
  context.logger.info(`TypeORM patch applied: ${target.file}`);
}

function patchQueryRunner(source: string, file: string): string {
  const expected = [
    '                "ALTER",',
    '                "DROP",',
    '            ].indexOf(command) !== -1) {',
  ].join('\n');
  const patched = [
    '                "ALTER",',
    '                "DROP",',
    '                "PRAGMA",',
    '            ].indexOf(command) !== -1) {',
  ].join('\n');
  const duplicated = [
    '                "ALTER",',
    '                "DROP",',
    '                "PRAGMA",',
    '                "PRAGMA",',
    '            ].indexOf(command) !== -1) {',
  ].join('\n');

  assertPatchable(source, file, expected, patched, duplicated);

  return source.replace(expected, patched).replace(duplicated, patched);
}

function patchDriver(source: string, file: string): string {
  return applyRequiredPatches(source, file, [
    [
      'await connection.execute(`PRAGMA foreign_keys = ON`);',
      'await connection.execute(`PRAGMA foreign_keys = ON`, false);',
    ],
    [
      'await connection.execute(`PRAGMA journal_mode = ${this.options.journalMode}`);',
      'await connection.execute(`PRAGMA journal_mode = ${this.options.journalMode}`, false);',
    ],
  ]);
}

function patchExpoDriver(source: string, file: string): string {
  return applyRequiredPatches(source, file, [
    [
      'return require("expo-sqlite");',
      'throw new error_1.DriverPackageNotInstalledError("Expo SQLite", "expo-sqlite");',
    ],
  ]);
}

function patchBrowserStringUtils(source: string, file: string): string {
  return applyRequiredPatches(source, file, [
    ['const crypto = require("node:crypto");', 'const crypto = undefined;'],
  ]);
}

function patchSqlJsBrowserBundle(source: string, file: string): string {
  return applyAlternativePatch(source, file, [
    [
      'if(Da){var fs=require("fs"),Ha=require("path");',
      'if(false&&Da){var fs=null,Ha=null;',
    ],
    ['if(ca){var fs=require("node:fs");', 'if(false&&ca){var fs=null;'],
  ]);
}

function applyRequiredPatches(
  source: string,
  file: string,
  patches: Array<readonly [string, string]>,
): string {
  let next = source;

  for (const [expected, patched] of patches) {
    assertPatchable(next, file, expected, patched);
    next = next.replace(expected, patched);
  }

  return next;
}

function assertPatchable(
  source: string,
  file: string,
  expected: string,
  patched: string,
  duplicated?: string,
): void {
  if (
    source.includes(expected) ||
    source.includes(patched) ||
    (duplicated && source.includes(duplicated))
  ) {
    return;
  }

  throw new Error(
    `TypeORM patch failed: ${file} did not contain the expected source or patched output.`,
  );
}

function applyAlternativePatch(
  source: string,
  file: string,
  patches: Array<readonly [string, string]>,
): string {
  for (const [expected, patched] of patches) {
    if (source.includes(patched)) {
      return source;
    }

    if (source.includes(expected)) {
      return source.replace(expected, patched);
    }
  }

  throw new Error(
    `TypeORM patch failed: ${file} did not contain any expected source or patched output.`,
  );
}
