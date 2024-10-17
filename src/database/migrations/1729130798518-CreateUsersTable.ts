import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1729130798518 implements MigrationInterface {
  name = 'CreateUsersTable1729130798518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`avatarUrl\` varchar(255) NULL, \`phoneNumber\` varchar(255) NULL, \`deviceId\` varchar(255) NULL, \`deviceToken\` varchar(255) NULL, \`deviceType\` enum ('android', 'ios', 'web', 'other') NOT NULL DEFAULT 'other', \`role\` enum ('admin', 'user', 'creator') NOT NULL DEFAULT 'user', \`loginType\` enum ('email', 'facebook', 'google', 'apple') NOT NULL DEFAULT 'email', \`lan\` enum ('vi', 'en') NOT NULL DEFAULT 'vi', \`gender\` enum ('male', 'female') NOT NULL DEFAULT 'female', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`partnerId\` int NULL, INDEX \`IDX_4f957cab9b20675e7a50a7ebfc\` (\`name\`), INDEX \`IDX_da8b40ba8bc48f3be743d48673\` (\`email\`), INDEX \`IDX_6f3b146c7345da5f7ec474edd4\` (\`phoneNumber\`), UNIQUE INDEX \`REL_7ae37bc9c3aa8f0d7d4e1c2b71\` (\`partnerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_7ae37bc9c3aa8f0d7d4e1c2b71f\` FOREIGN KEY (\`partnerId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_7ae37bc9c3aa8f0d7d4e1c2b71f\``);
    await queryRunner.query(`DROP INDEX \`REL_7ae37bc9c3aa8f0d7d4e1c2b71\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`IDX_6f3b146c7345da5f7ec474edd4\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`IDX_da8b40ba8bc48f3be743d48673\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`IDX_4f957cab9b20675e7a50a7ebfc\` ON \`users\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
