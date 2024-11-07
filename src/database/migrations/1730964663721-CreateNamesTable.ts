import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNamesTable1730964663721 implements MigrationInterface {
  name = 'CreateNamesTable1730964663721';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`names\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`meaning\` text NOT NULL, \`lan\` enum ('vi', 'en') NOT NULL DEFAULT 'vi', \`gender\` enum ('male', 'female') NOT NULL DEFAULT 'female', INDEX \`IDX_a74cd743091a556eb77e02850d\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_a74cd743091a556eb77e02850d\` ON \`names\``,
    );
    await queryRunner.query(`DROP TABLE \`names\``);
  }
}
