export interface NgAddSchema {
  readonly databaseName?: string;
  readonly project?: string;
  readonly skipAppConfig?: boolean;
  readonly skipPackageJson?: boolean;
}
