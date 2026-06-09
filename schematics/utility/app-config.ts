import { Tree } from '@angular-devkit/schematics';

import { joinPaths, ProjectDefinition } from './workspace';

export function updateAppConfig(tree: Tree, project: ProjectDefinition): void {
  const appConfigPath = joinPaths(project.sourceRoot, 'app/app.config.ts');

  if (!tree.exists(appConfigPath)) {
    return;
  }

  const current = tree.readText(appConfigPath);
  let next = addImport(
    current,
    "import { appDatabaseOptions } from './database/database.config';",
  );
  next = addImport(
    next,
    "import { provideDatabase } from './typeorm/database.providers';",
  );
  next = addProvider(next, 'provideDatabase(appDatabaseOptions)');

  if (next !== current) {
    tree.overwrite(appConfigPath, next);
  }
}

export function addImport(source: string, importStatement: string): string {
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

export function addProvider(source: string, providerExpression: string): string {
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
