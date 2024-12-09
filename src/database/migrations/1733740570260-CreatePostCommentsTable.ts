import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostCommentsTable1733740570260
  implements MigrationInterface
{
  name = 'CreatePostCommentsTable1733740570260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`post-comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`postId\` int NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post-comments\` ADD CONSTRAINT \`FK_1e8a0191a29feda8b2b7a91b9a7\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post-comments\` ADD CONSTRAINT \`FK_09a2c0048aede5447bbd7a6fc2d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post-comments\` DROP FOREIGN KEY \`FK_09a2c0048aede5447bbd7a6fc2d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post-comments\` DROP FOREIGN KEY \`FK_1e8a0191a29feda8b2b7a91b9a7\``,
    );
    await queryRunner.query(`DROP TABLE \`post-comments\``);
  }
}
