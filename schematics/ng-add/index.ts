import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';

import { updateAngularJson } from '../utility/angular-json';
import { updateAppConfig } from '../utility/app-config';
import { updatePackageJson } from '../utility/package-json';
import { getProjectDefinition } from '../utility/workspace';
import { NgAddSchema } from './schema';

export function ngAdd(options: NgAddSchema): Rule {
  return (tree: Tree, context) => {
    const project = getProjectDefinition(tree, options.project);
    const databaseName = options.databaseName ?? 'transaction';

    const rules: Rule[] = [
      mergeWith(
        apply(url('./files'), [
          template({
            databaseName,
            sourceRoot: project.sourceRoot,
          }),
          move('/'),
        ]),
      ),
      () => {
        updateAngularJson(tree, project.name);

        if (!options.skipPackageJson) {
          updatePackageJson(tree);
          const installTaskId = context.addTask(new NodePackageInstallTask());
          context.addTask(new RunSchematicTask('patch-typeorm', {}), [
            installTaskId,
          ]);
        } else {
          context.addTask(new RunSchematicTask('patch-typeorm', {}));
        }

        if (!options.skipAppConfig) {
          updateAppConfig(tree, project);
        }

        return tree;
      },
    ];

    return chain(rules)(tree, context);
  };
}
