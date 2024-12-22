import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationsTable1734603090074
  implements MigrationInterface
{
  name = 'CreateNotificationsTable1734603090074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`body\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`actorId\` int NOT NULL, \`postId\` int NOT NULL, \`readed\` tinyint NOT NULL DEFAULT 0, \`type\` enum ('system', 'follow', 'new_post', 'like_post', 'comment_post', 'save_post') NOT NULL DEFAULT 'system', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_692a909ee0fa9383e7859f9b406\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_44412a2d6f162ff4dc1697d0db7\` FOREIGN KEY (\`actorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_93c464aaf70fb0720dc500e93c8\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_93c464aaf70fb0720dc500e93c8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_44412a2d6f162ff4dc1697d0db7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_692a909ee0fa9383e7859f9b406\``,
    );
    await queryRunner.query(`DROP TABLE \`notifications\``);
  }
}
