import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBabyInfosTable1730000260418 implements MigrationInterface {
  name = 'CreateBabyInfosTable1730000260418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`baby_infos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`week\` int NOT NULL, \`weight\` double NOT NULL, \`height\` double NOT NULL, \`thumbnail3D\` varchar(255) NULL, \`image3DUrl\` varchar(255) NULL, \`symbolicImageUrl\` text NULL, \`sizeShortDescription\` text NULL, \`babyOverallInfo\` text NULL, \`babySizeInfo\` text NULL, UNIQUE INDEX \`IDX_36ccbbd2115584cb472df2dfd2\` (\`week\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_36ccbbd2115584cb472df2dfd2\` ON \`baby_infos\``,
    );
    await queryRunner.query(`DROP TABLE \`baby_infos\``);
  }
}
