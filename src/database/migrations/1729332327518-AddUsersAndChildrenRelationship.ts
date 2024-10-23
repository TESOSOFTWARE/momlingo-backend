import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersAndChildrenRelationship1729332327518
  implements MigrationInterface
{
  name = 'AddUsersAndChildrenRelationship1729332327518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`children\` ADD \`motherId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`children\` ADD \`fatherId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`children\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`children\` ADD CONSTRAINT \`FK_3209d6e4b254a919cd1ae397680\` FOREIGN KEY (\`motherId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`children\` ADD CONSTRAINT \`FK_273a4ebfe9ffcf6b4993f27f78d\` FOREIGN KEY (\`fatherId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`children\` DROP FOREIGN KEY \`FK_273a4ebfe9ffcf6b4993f27f78d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`children\` DROP FOREIGN KEY \`FK_3209d6e4b254a919cd1ae397680\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`children\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`children\` DROP COLUMN \`fatherId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`children\` DROP COLUMN \`motherId\``,
    );
  }
}
