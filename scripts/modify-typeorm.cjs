const fs = require('fs');

const targets = [
  {
    file: './node_modules/typeorm/driver/capacitor/CapacitorQueryRunner.js',
    patch: patchQueryRunner,
  },
  {
    file: './node_modules/typeorm/browser/driver/capacitor/CapacitorQueryRunner.js',
    patch: patchQueryRunner,
  },
  {
    file: './node_modules/typeorm/driver/capacitor/CapacitorDriver.js',
    patch: patchDriver,
  },
  {
    file: './node_modules/typeorm/browser/driver/capacitor/CapacitorDriver.js',
    patch: patchDriver,
  },
  {
    file: './node_modules/typeorm/driver/expo/ExpoDriver.js',
    patch: patchExpoDriver,
  },
  {
    file: './node_modules/typeorm/browser/driver/expo/ExpoDriver.js',
    patch: patchExpoDriver,
  },
  {
    file: './node_modules/typeorm/browser/util/StringUtils.js',
    patch: patchBrowserStringUtils,
  },
  {
    file: './node_modules/sql.js/dist/sql-wasm.js',
    patch: patchSqlJsBrowserBundle,
  },
];

for (const target of targets) {
  patchFile(target.file, target.patch);
}

function patchFile(file, patch) {
  if (!fs.existsSync(file)) {
    console.warn(`TypeORM patch skipped: ${file} was not found.`);
    return;
  }

  const current = fs.readFileSync(file, 'utf8');
  const next = patch(current, file);

  if (current === next) {
    console.log(`TypeORM patch already applied: ${file}`);
    return;
  }

  fs.writeFileSync(file, next, 'utf8');
  console.log(`TypeORM patch applied: ${file}`);
}

function patchQueryRunner(source, file) {
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

function patchDriver(source, file) {
  const patches = [
    [
      'await connection.execute(`PRAGMA foreign_keys = ON`);',
      'await connection.execute(`PRAGMA foreign_keys = ON`, false);',
    ],
    [
      'await connection.execute(`PRAGMA journal_mode = ${this.options.journalMode}`);',
      'await connection.execute(`PRAGMA journal_mode = ${this.options.journalMode}`, false);',
    ],
  ];

  return applyRequiredPatches(source, file, patches);
}

function patchExpoDriver(source, file) {
  return applyRequiredPatches(source, file, [
    [
      'return require("expo-sqlite");',
      'throw new error_1.DriverPackageNotInstalledError("Expo SQLite", "expo-sqlite");',
    ],
  ]);
}

function patchBrowserStringUtils(source, file) {
  return applyRequiredPatches(source, file, [
    [
      'const crypto = require("node:crypto");',
      'const crypto = undefined;',
    ],
  ]);
}

function patchSqlJsBrowserBundle(source, file) {
  return applyRequiredPatches(source, file, [
    [
      'if(Da){var fs=require("fs"),Ha=require("path");',
      'if(false&&Da){var fs=null,Ha=null;',
    ],
  ]);
}

function applyRequiredPatches(source, file, patches) {
  let next = source;

  for (const [expected, patched] of patches) {
    assertPatchable(next, file, expected, patched);
    next = next.replace(expected, patched);
  }

  return next;
}

function assertPatchable(source, file, expected, patched, duplicated) {
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
