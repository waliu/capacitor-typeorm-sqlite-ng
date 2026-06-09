import {
  EnvironmentProviders,
  InjectionToken,
  Provider,
} from '@angular/core';
import { Repository } from 'typeorm/browser';

import { <%= className %>TypeormEntity } from '../database/entities/<%= name %>/<%= name %>.typeorm-entity';
import { TypeOrm<%= className %>Repository } from '../database/repositories/<%= name %>/<%= name %>.typeorm-repository';
import { <%= className %>Controller } from '../services/controllers/<%= name %>/<%= name %>.controller';
import { <%= className %>Repository } from '../services/repositories/<%= name %>/<%= name %>.repository';
import { <%= className %>Service } from '../services/services/<%= name %>/<%= name %>.service';
import { getRepositoryToken } from '../typeorm/repositories/repository-token';
import { provideRepository } from '../typeorm/repositories/repository.providers';

export const <%= constantName %>_REPOSITORY =
  new InjectionToken<<%= className %>Repository>('<%= constantName %>_REPOSITORY');

export function provide<%= className %>Services(): Array<EnvironmentProviders | Provider> {
  return [
    provideRepository(<%= className %>TypeormEntity),
    {
      provide: <%= constantName %>_REPOSITORY,
      deps: [getRepositoryToken(<%= className %>TypeormEntity)],
      useFactory: (repository: Repository<<%= className %>TypeormEntity>): <%= className %>Repository =>
        new TypeOrm<%= className %>Repository(repository),
    },
    {
      provide: <%= className %>Service,
      deps: [<%= constantName %>_REPOSITORY],
      useFactory: (<%= camelName %>Repository: <%= className %>Repository): <%= className %>Service =>
        new <%= className %>Service(<%= camelName %>Repository),
    },
    {
      provide: <%= className %>Controller,
      deps: [<%= className %>Service],
      useFactory: (<%= camelName %>Service: <%= className %>Service): <%= className %>Controller =>
        new <%= className %>Controller(<%= camelName %>Service),
    },
  ];
}
