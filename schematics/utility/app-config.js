"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppConfig = updateAppConfig;
exports.addImport = addImport;
exports.addProvider = addProvider;
const workspace_1 = require("./workspace");
function updateAppConfig(tree, project) {
    const appConfigPath = (0, workspace_1.joinPaths)(project.sourceRoot, 'app/app.config.ts');
    if (!tree.exists(appConfigPath)) {
        return;
    }
    const current = tree.readText(appConfigPath);
    let next = addImport(current, "import { appDatabaseOptions } from './database/database.config';");
    next = addImport(next, "import { provideDatabase } from './typeorm/database.providers';");
    next = addProvider(next, 'provideDatabase(appDatabaseOptions)');
    if (next !== current) {
        tree.overwrite(appConfigPath, next);
    }
}
function addImport(source, importStatement) {
    if (source.includes(importStatement)) {
        return source;
    }
    const importMatches = [...source.matchAll(/^import .+;$/gm)];
    const lastImport = importMatches.at(-1);
    if (!lastImport?.index) {
        return `${importStatement}\n${source}`;
    }
    const insertAt = lastImport.index + lastImport[0].length;
    return `${source.slice(0, insertAt)}\n${importStatement}${source.slice(insertAt)}`;
}
function addProvider(source, providerExpression) {
    if (source.includes(providerExpression)) {
        return source;
    }
    const providersIndex = source.indexOf('providers: [');
    if (providersIndex === -1) {
        return source;
    }
    const insertAt = providersIndex + 'providers: ['.length;
    return `${source.slice(0, insertAt)}\n    ${providerExpression},${source.slice(insertAt)}`;
}
