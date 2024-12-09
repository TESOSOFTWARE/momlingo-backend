import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLikesTable1733739149782 implements MigrationInterface {
  name = 'CreateLikesTable1733739149782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_e2fe567ad8d305fefc918d44f50\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_cfd8e81fac09d7339a32e57d904\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_cfd8e81fac09d7339a32e57d904\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_e2fe567ad8d305fefc918d44f50\``,
    );
    await queryRunner.query(`DROP TABLE \`likes\``);
  }
}
