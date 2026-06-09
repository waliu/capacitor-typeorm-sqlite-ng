export interface DomainSchema {
  readonly name: string;
  readonly project?: string;
  readonly skipRegistration?: boolean;
  readonly tableName?: string;
}
