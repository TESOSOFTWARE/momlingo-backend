import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1729130798518 implements MigrationInterface {
  name = 'CreateUsersTable1729130798518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b19cfff51c326508beea260b739\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_b19cfff51c326508beea260b73\` ON \`users\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`partnerId\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`gender\` enum ('male', 'female') NOT NULL DEFAULT 'female'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`deviceType\` \`deviceType\` enum ('android', 'ios', 'web', 'other') NOT NULL DEFAULT 'other'`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\` (\`email\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`deviceType\` \`deviceType\` enum ('android', 'ios', 'web', 'other') NOT NULL DEFAULT 'android'`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updatedAt\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`gender\``);
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`partnerId\` int NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_b19cfff51c326508beea260b73\` ON \`users\` (\`partnerId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_b19cfff51c326508beea260b739\` FOREIGN KEY (\`partnerId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
