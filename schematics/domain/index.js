"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domain = domain;
const schematics_1 = require("@angular-devkit/schematics");
const app_config_1 = require("../utility/app-config");
const workspace_1 = require("../utility/workspace");
function domain(options) {
    return (tree, context) => {
        const project = (0, workspace_1.getProjectDefinition)(tree, options.project);
        const normalizedName = schematics_1.strings.dasherize(options.name);
        const className = schematics_1.strings.classify(normalizedName);
        const camelName = schematics_1.strings.camelize(normalizedName);
        const constantName = schematics_1.strings.underscore(normalizedName).toUpperCase();
        const tableName = options.tableName ?? normalizedName;
        const rules = [
            (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)('./files'), [
                (0, schematics_1.template)({
                    ...schematics_1.strings,
                    camelName,
                    className,
                    constantName,
                    name: normalizedName,
                    sourceRoot: project.sourceRoot,
                    tableName,
                }),
                (0, schematics_1.move)('/'),
            ])),
            () => {
                if (!options.skipRegistration) {
                    registerDomain(tree, project.sourceRoot, {
                        camelName,
                        className,
                        name: normalizedName,
                    });
                }
                return tree;
            },
        ];
        return (0, schematics_1.chain)(rules)(tree, context);
    };
}
function registerDomain(tree, sourceRoot, domainInfo) {
    updateDatabaseConfig(tree, sourceRoot, domainInfo);
    updateApplicationProviders(tree, sourceRoot, domainInfo);
}
function updateDatabaseConfig(tree, sourceRoot, domainInfo) {
    const path = (0, workspace_1.joinPaths)(sourceRoot, 'app/database/database.config.ts');
    if (!tree.exists(path)) {
        return;
    }
    const entityName = `${domainInfo.className}TypeormEntity`;
    let next = tree.readText(path);
    next = (0, app_config_1.addImport)(next, `import { ${entityName} } from './entities/${domainInfo.name}/${domainInfo.name}.typeorm-entity';`);
    next = addArrayEntry(next, 'entities', entityName);
    tree.overwrite(path, next);
}
function updateApplicationProviders(tree, sourceRoot, domainInfo) {
    const path = (0, workspace_1.joinPaths)(sourceRoot, 'app/composition/application.providers.ts');
    if (!tree.exists(path)) {
        return;
    }
    let next = tree.readText(path);
    const providerName = `provide${domainInfo.className}Services`;
    next = (0, app_config_1.addImport)(next, `import { ${providerName} } from './${domainInfo.name}.providers';`);
    next = (0, app_config_1.addProvider)(next, `...${providerName}()`);
    tree.overwrite(path, next);
}
function addArrayEntry(source, arrayName, entry) {
    if (source.includes(entry)) {
        return source;
    }
    const arrayStart = source.indexOf(`${arrayName}: [`);
    if (arrayStart === -1) {
        return source;
    }
    const insertAt = arrayStart + `${arrayName}: [`.length;
    return `${source.slice(0, insertAt)}${entry}, ${source.slice(insertAt)}`;
}
