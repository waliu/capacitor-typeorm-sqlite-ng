import { InjectionToken } from '@angular/core';
import { EntityTarget, ObjectLiteral, Repository } from 'typeorm/browser';

export function getRepositoryToken<Entity extends ObjectLiteral>(
  entity: EntityTarget<Entity>,
): InjectionToken<Repository<Entity>> {
  const name = typeof entity === 'function' ? entity.name : String(entity);

  return new InjectionToken<Repository<Entity>>(`${name}Repository`);
}
