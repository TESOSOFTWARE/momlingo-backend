import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePartnerColumnInUsers1729136622798
  implements MigrationInterface
{
  name = 'UpdatePartnerColumnInUsers1729136622798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_b19cfff51c326508beea260b73\` ON \`users\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`children\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`children\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_b19cfff51c326508beea260b73\` ON \`users\` (\`partnerId\`)`,
    );
  }
}
