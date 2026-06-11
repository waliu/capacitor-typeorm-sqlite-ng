"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchTypeorm = patchTypeorm;
const targets = [
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
function patchTypeorm(_options) {
    return (tree, context) => {
        for (const target of targets) {
            patchFile(tree, context, target);
        }
        return tree;
    };
}
function patchFile(tree, context, target) {
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
        ['const crypto = require("node:crypto");', 'const crypto = undefined;'],
    ]);
}
function patchSqlJsBrowserBundle(source, file) {
    return applyAlternativePatch(source, file, [
        [
            'if(Da){var fs=require("fs"),Ha=require("path");',
            'if(false&&Da){var fs=null,Ha=null;',
        ],
        ['if(ca){var fs=require("node:fs");', 'if(false&&ca){var fs=null;'],
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
    if (source.includes(expected) ||
        source.includes(patched) ||
        (duplicated && source.includes(duplicated))) {
        return;
    }
    throw new Error(`TypeORM patch failed: ${file} did not contain the expected source or patched output.`);
}
function applyAlternativePatch(source, file, patches) {
    for (const [expected, patched] of patches) {
        if (source.includes(patched)) {
            return source;
        }
        if (source.includes(expected)) {
            return source.replace(expected, patched);
        }
    }
    throw new Error(`TypeORM patch failed: ${file} did not contain any expected source or patched output.`);
}
