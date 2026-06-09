import { EntitySchema } from 'typeorm/browser';

export type DatabaseEntity = Function | string | EntitySchema;
export type DatabaseMigration = Function | string;

export interface DatabaseSchema {
  readonly entities: DatabaseEntity[];
  readonly migrations: DatabaseMigration[];
}

export interface DatabaseOptions {
  readonly databaseName: string;
  readonly schema: DatabaseSchema;
}
