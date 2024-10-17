import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePartnerColumnInUsers1729136622798
  implements MigrationInterface
{
  name = 'UpdatePartnerColumnInUsers1729136622798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`children\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`children\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
  }
}
