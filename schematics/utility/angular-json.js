"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAngularJson = updateAngularJson;
const json_1 = require("./json");
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
function updateAngularJson(tree, projectName) {
    const workspace = (0, json_1.readJson)(tree, 'angular.json');
    const projects = workspace['projects'];
    const project = projects?.[projectName];
    if (!project) {
        throw new Error(`Angular project not found: ${projectName}`);
    }
    const targets = (project['architect'] ?? project['targets']);
    const build = targets?.['build'];
    const options = build?.['options'];
    if (!options) {
        throw new Error(`Build options not found for Angular project: ${projectName}`);
    }
    options['assets'] = addUniqueObject(ensureArray(options['assets']), sqlWasmAsset);
    options['allowedCommonJsDependencies'] = addUniqueValues(ensureStringArray(options['allowedCommonJsDependencies']), commonJsDependencies);
    if (!build) {
        throw new Error(`Build target not found for Angular project: ${projectName}`);
    }
    const configurations = ensureObject(build, 'configurations');
    const native = ensureObject(configurations, 'native');
    native['assets'] = addUniqueObject(ensureArray(native['assets']), publicAsset);
    (0, json_1.writeJson)(tree, 'angular.json', workspace);
}
function ensureObject(parent, key) {
    const value = parent[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value;
    }
    const next = {};
    parent[key] = next;
    return next;
}
function ensureArray(value) {
    return Array.isArray(value) ? value : [];
}
function ensureStringArray(value) {
    return Array.isArray(value)
        ? value.filter((entry) => typeof entry === 'string')
        : [];
}
function addUniqueValues(values, additions) {
    return [...values, ...additions.filter((value) => !values.includes(value))];
}
function addUniqueObject(values, addition) {
    const serialized = JSON.stringify(addition);
    if (values.some((value) => JSON.stringify(value) === serialized)) {
        return values;
    }
    return [...values, addition];
}
