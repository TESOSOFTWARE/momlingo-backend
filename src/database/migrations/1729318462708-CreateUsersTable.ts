import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1729318462708 implements MigrationInterface {
  name = 'CreateUsersTable1729318462708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`avatarUrl\` varchar(255) NULL, \`phoneNumber\` varchar(255) NULL, \`deviceId\` varchar(255) NULL, \`deviceToken\` varchar(255) NULL, \`deviceType\` enum ('android', 'ios', 'web', 'other') NOT NULL DEFAULT 'other', \`role\` enum ('admin', 'user', 'creator') NOT NULL DEFAULT 'user', \`loginType\` enum ('email', 'facebook', 'google', 'apple') NOT NULL DEFAULT 'email', \`lan\` enum ('vi', 'en') NOT NULL DEFAULT 'vi', \`gender\` enum ('male', 'female') NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`partnerId\` int NULL, INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`), INDEX \`IDX_1e3d0240b49c40521aaeb95329\` (\`phoneNumber\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`REL_b19cfff51c326508beea260b73\` (\`partnerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_b19cfff51c326508beea260b739\` FOREIGN KEY (\`partnerId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b19cfff51c326508beea260b739\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_b19cfff51c326508beea260b73\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1e3d0240b49c40521aaeb95329\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
