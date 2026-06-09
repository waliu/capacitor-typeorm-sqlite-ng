"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngAdd = ngAdd;
const schematics_1 = require("@angular-devkit/schematics");
const angular_json_1 = require("../utility/angular-json");
const app_config_1 = require("../utility/app-config");
const package_json_1 = require("../utility/package-json");
const workspace_1 = require("../utility/workspace");
function ngAdd(options) {
    return (tree, context) => {
        const project = (0, workspace_1.getProjectDefinition)(tree, options.project);
        const databaseName = options.databaseName ?? 'transaction';
        const rules = [
            (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)('./files'), [
                (0, schematics_1.template)({
                    databaseName,
                    sourceRoot: project.sourceRoot,
                }),
                (0, schematics_1.move)('/'),
            ])),
            () => {
                (0, angular_json_1.updateAngularJson)(tree, project.name);
                if (!options.skipPackageJson) {
                    (0, package_json_1.updatePackageJson)(tree);
                }
                if (!options.skipAppConfig) {
                    (0, app_config_1.updateAppConfig)(tree, project);
                }
                return tree;
            },
        ];
        return (0, schematics_1.chain)(rules)(tree, context);
    };
}
