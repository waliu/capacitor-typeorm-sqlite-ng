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
  const next = patch(current);

  if (current === next) {
    console.log(`TypeORM patch already applied: ${file}`);
    return;
  }

  fs.writeFileSync(file, next, 'utf8');
  console.log(`TypeORM patch applied: ${file}`);
}

function patchQueryRunner(source) {
  return source
    .replace(
      [
        '                "ALTER",',
        '                "DROP",',
        '            ].indexOf(command) !== -1) {',
      ].join('\n'),
      [
        '                "ALTER",',
        '                "DROP",',
        '                "PRAGMA",',
        '            ].indexOf(command) !== -1) {',
      ].join('\n'),
    )
    .replace(
      [
        '                "ALTER",',
        '                "DROP",',
        '                "PRAGMA",',
        '                "PRAGMA",',
        '            ].indexOf(command) !== -1) {',
      ].join('\n'),
      [
        '                "ALTER",',
        '                "DROP",',
        '                "PRAGMA",',
        '            ].indexOf(command) !== -1) {',
      ].join('\n'),
    );
}

function patchDriver(source) {
  return source
    .replace(
      'await connection.execute(`PRAGMA foreign_keys = ON`);',
      'await connection.execute(`PRAGMA foreign_keys = ON`, false);',
    )
    .replace(
      'await connection.execute(`PRAGMA journal_mode = ${this.options.journalMode}`);',
      'await connection.execute(`PRAGMA journal_mode = ${this.options.journalMode}`, false);',
    );
}

function patchExpoDriver(source) {
  return source.replace(
    'return require("expo-sqlite");',
    'throw new error_1.DriverPackageNotInstalledError("Expo SQLite", "expo-sqlite");',
  );
}

function patchBrowserStringUtils(source) {
  return source.replace(
    'const crypto = require("node:crypto");',
    'const crypto = undefined;',
  );
}

function patchSqlJsBrowserBundle(source) {
  return source.replace(
    'if(Da){var fs=require("fs"),Ha=require("path");',
    'if(false&&Da){var fs=null,Ha=null;',
  );
}
