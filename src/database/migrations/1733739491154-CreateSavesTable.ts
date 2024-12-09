import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSavesTable1733739491154 implements MigrationInterface {
  name = 'CreateSavesTable1733739491154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`saves\` (\`id\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`saves\` ADD CONSTRAINT \`FK_9b20955d9c5893f5b8270eb5a72\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`saves\` ADD CONSTRAINT \`FK_d796c6abad59c251dcb412c9d7f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`saves\` DROP FOREIGN KEY \`FK_d796c6abad59c251dcb412c9d7f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`saves\` DROP FOREIGN KEY \`FK_9b20955d9c5893f5b8270eb5a72\``,
    );
    await queryRunner.query(`DROP TABLE \`saves\``);
  }
}
