import { EntityTarget, ObjectLiteral, Repository } from 'typeorm/browser';

export interface DataSourceProvider {
  readonly databaseName: string;
  readonly platform: string;
  readonly initialized: boolean;

  initialize(): Promise<void>;
  persist(): Promise<void>;
  getRepository<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
  ): Repository<Entity>;
}
