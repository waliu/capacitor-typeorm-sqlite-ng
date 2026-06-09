import {
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { EntityTarget, ObjectLiteral, Repository } from 'typeorm/browser';

import { DatabaseService } from '../database.service';
import { getRepositoryToken } from './repository-token';

export function provideRepository<Entity extends ObjectLiteral>(
  entity: EntityTarget<Entity>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: getRepositoryToken(entity),
      deps: [DatabaseService],
      useFactory: (database: DatabaseService): Repository<Entity> =>
        database.getInitializedDataSource().getRepository(entity),
    },
  ]);
}
