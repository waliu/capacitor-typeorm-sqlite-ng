import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  strings,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';

import { addImport, addProvider } from '../utility/app-config';
import { getProjectDefinition, joinPaths } from '../utility/workspace';
import { DomainSchema } from './schema';

export function domain(options: DomainSchema): Rule {
  return (tree: Tree, context) => {
    const project = getProjectDefinition(tree, options.project);
    const normalizedName = strings.dasherize(options.name);
    const className = strings.classify(normalizedName);
    const camelName = strings.camelize(normalizedName);
    const constantName = strings.underscore(normalizedName).toUpperCase();
    const tableName = options.tableName ?? normalizedName;

    const rules: Rule[] = [
      mergeWith(
        apply(url('./files'), [
          template({
            ...strings,
            camelName,
            className,
            constantName,
            name: normalizedName,
            sourceRoot: project.sourceRoot,
            tableName,
          }),
          move('/'),
        ]),
      ),
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

    return chain(rules)(tree, context);
  };
}

interface DomainRegistration {
  readonly camelName: string;
  readonly className: string;
  readonly name: string;
}

function registerDomain(
  tree: Tree,
  sourceRoot: string,
  domainInfo: DomainRegistration,
): void {
  updateDatabaseConfig(tree, sourceRoot, domainInfo);
  updateApplicationProviders(tree, sourceRoot, domainInfo);
}

function updateDatabaseConfig(
  tree: Tree,
  sourceRoot: string,
  domainInfo: DomainRegistration,
): void {
  const path = joinPaths(sourceRoot, 'app/database/database.config.ts');

  if (!tree.exists(path)) {
    return;
  }

  const entityName = `${domainInfo.className}TypeormEntity`;
  let next = tree.readText(path);
  next = addImport(
    next,
    `import { ${entityName} } from './entities/${domainInfo.name}/${domainInfo.name}.typeorm-entity';`,
  );
  next = addArrayEntry(next, 'entities', entityName);

  tree.overwrite(path, next);
}

function updateApplicationProviders(
  tree: Tree,
  sourceRoot: string,
  domainInfo: DomainRegistration,
): void {
  const path = joinPaths(sourceRoot, 'app/composition/application.providers.ts');

  if (!tree.exists(path)) {
    return;
  }

  let next = tree.readText(path);
  const providerName = `provide${domainInfo.className}Services`;
  next = addImport(
    next,
    `import { ${providerName} } from './${domainInfo.name}.providers';`,
  );
  next = addProvider(next, `...${providerName}()`);

  tree.overwrite(path, next);
}

function addArrayEntry(source: string, arrayName: string, entry: string): string {
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
