"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJson = readJson;
exports.writeJson = writeJson;
function readJson(tree, path) {
    const buffer = tree.read(path);
    if (!buffer) {
        throw new Error(`Required JSON file not found: ${path}`);
    }
    return JSON.parse(buffer.toString('utf-8'));
}
function writeJson(tree, path, value) {
    tree.overwrite(path, `${JSON.stringify(value, null, 2)}\n`);
}
