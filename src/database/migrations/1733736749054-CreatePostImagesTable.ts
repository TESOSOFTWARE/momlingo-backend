import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostImagesTable1733736749054 implements MigrationInterface {
  name = 'CreatePostImagesTable1733736749054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`post_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`imageUrl\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_images\` ADD CONSTRAINT \`FK_92e2382a7f43d4e9350d591fb6a\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post_images\` DROP FOREIGN KEY \`FK_92e2382a7f43d4e9350d591fb6a\``,
    );
    await queryRunner.query(`DROP TABLE \`post_images\``);
  }
}
