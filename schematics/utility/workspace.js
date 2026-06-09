"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectDefinition = getProjectDefinition;
exports.joinPaths = joinPaths;
const json_1 = require("./json");
function getProjectDefinition(tree, projectName) {
    const workspace = (0, json_1.readJson)(tree, 'angular.json');
    const resolvedName = projectName ?? getFirstApplicationProjectName(workspace);
    const project = workspace.projects[resolvedName];
    if (!project) {
        throw new Error(`Angular project not found: ${resolvedName}`);
    }
    return {
        name: resolvedName,
        root: project.root ?? '',
        sourceRoot: project.sourceRoot ?? joinPaths(project.root ?? '', 'src'),
    };
}
function getFirstApplicationProjectName(workspace) {
    const project = Object.entries(workspace.projects).find(([, value]) => value.projectType === 'application');
    if (!project) {
        throw new Error('No Angular application project found in angular.json.');
    }
    return project[0];
}
function joinPaths(...parts) {
    return parts
        .filter(Boolean)
        .join('/')
        .replace(/\\/g, '/')
        .replace(/\/+/g, '/');
}
