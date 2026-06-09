import { MigrationInterface, QueryRunner } from 'typeorm/browser';

export class InitializePlatformDb1730764800000 implements MigrationInterface {
  name = 'InitializePlatformDb1730764800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS sys_user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name VARCHAR(32) NOT NULL,
        password VARCHAR(256) NOT NULL
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS sys_user;');
  }
}
