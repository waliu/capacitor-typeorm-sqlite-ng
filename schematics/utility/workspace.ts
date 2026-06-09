import { Tree } from '@angular-devkit/schematics';

import { readJson } from './json';

interface AngularWorkspaceProject {
  readonly projectType?: string;
  readonly root?: string;
  readonly sourceRoot?: string;
  readonly architect?: Record<string, unknown>;
  readonly targets?: Record<string, unknown>;
}

interface AngularWorkspace {
  readonly projects: Record<string, AngularWorkspaceProject>;
}

export interface ProjectDefinition {
  readonly name: string;
  readonly root: string;
  readonly sourceRoot: string;
}

export function getProjectDefinition(
  tree: Tree,
  projectName?: string,
): ProjectDefinition {
  const workspace = readJson<AngularWorkspace>(tree, 'angular.json');
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

function getFirstApplicationProjectName(workspace: AngularWorkspace): string {
  const project = Object.entries(workspace.projects).find(
    ([, value]) => value.projectType === 'application',
  );

  if (!project) {
    throw new Error('No Angular application project found in angular.json.');
  }

  return project[0];
}

export function joinPaths(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .join('/')
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/');
}
