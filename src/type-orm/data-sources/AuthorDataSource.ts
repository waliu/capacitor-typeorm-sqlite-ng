import { DataSource } from 'typeorm';
import { SQLiteService } from '../services/sqlite.service';
import { SQLiteConnection } from "@capacitor-community/sqlite";
import { SysUser } from "../entities/sys-user";
import { InitializePlatformDb20241151 } from "../migrations/Initialize-platform-db-2024-11-5-1";

const sqliteService: SQLiteService = new SQLiteService();
const sqliteConnection: SQLiteConnection = sqliteService.getSqliteConnection();
export default new DataSource({
  type: 'capacitor',
  driver: sqliteConnection,
  database: 'transaction',
  mode: 'no-encryption',
  entities: [SysUser],
  migrations: [InitializePlatformDb20241151],
  subscribers: [],
  logging: [/*'query',*/ 'error', 'schema'],
  synchronize: false,
  migrationsRun: false,
});
