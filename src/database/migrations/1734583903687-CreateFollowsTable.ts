import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFollowsTable1734583903687 implements MigrationInterface {
  name = 'CreateFollowsTable1734583903687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`follows\` (\`id\` int NOT NULL AUTO_INCREMENT, \`followerId\` int NULL, \`followedId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_fdb91868b03a2040db408a5333\` ON \`follows\` (\`followerId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_d5ab44405d07cecac582c6448b\` ON \`follows\` (\`followedId\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_d5ab44405d07cecac582c6448b\` ON \`follows\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fdb91868b03a2040db408a5333\` ON \`follows\``,
    );
    await queryRunner.query(`DROP TABLE \`follows\``);
  }
}
