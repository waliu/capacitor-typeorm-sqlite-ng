import { InjectionToken } from '@angular/core';
import { EntityTarget, ObjectLiteral, Repository } from 'typeorm/browser';

const repositoryTokenMap = new Map<
  EntityTarget<ObjectLiteral>,
  InjectionToken<Repository<ObjectLiteral>>
>();

export function getRepositoryToken<Entity extends ObjectLiteral>(
  entity: EntityTarget<Entity>,
): InjectionToken<Repository<Entity>> {
  const existingToken = repositoryTokenMap.get(
    entity as EntityTarget<ObjectLiteral>,
  );

  if (existingToken) {
    return existingToken as InjectionToken<Repository<Entity>>;
  }

  const token = new InjectionToken<Repository<Entity>>(
    `TYPEORM_REPOSITORY_${getEntityName(entity)}`,
  );

  repositoryTokenMap.set(
    entity as EntityTarget<ObjectLiteral>,
    token as InjectionToken<Repository<ObjectLiteral>>,
  );

  return token;
}

function getEntityName<Entity extends ObjectLiteral>(
  entity: EntityTarget<Entity>,
): string {
  if (typeof entity === 'function') {
    return entity.name;
  }

  if (typeof entity === 'string') {
    return entity;
  }

  if ('options' in entity) {
    return String(entity.options.name);
  }

  return entity.name;
}
