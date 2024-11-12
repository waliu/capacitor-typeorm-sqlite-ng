import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializePlatformDb20241151 implements MigrationInterface {
  name: string = "InitializePlatform1671880018001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE sys_user (
          user_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_name VARCHAR(32) NOT NULL,
          password VARCHAR(256) NOT NULL
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sys_user";`);
  }
}
