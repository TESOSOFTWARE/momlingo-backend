import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBabyTrackersTableAndReleastionship1730000929204
  implements MigrationInterface
{
  name = 'CreateBabyTrackersTableAndReleastionship1730000929204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`baby_trackers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`week\` int NOT NULL, \`keyTakeaways\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`babyInfoId\` int NULL, \`momInfoId\` int NULL, UNIQUE INDEX \`IDX_8994c7be87ad26dccc642df221\` (\`week\`), UNIQUE INDEX \`REL_5c4f38e41a09f3855da10089f2\` (\`babyInfoId\`), UNIQUE INDEX \`REL_9328c869534975246fa8511566\` (\`momInfoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`baby_trackers\` ADD CONSTRAINT \`FK_5c4f38e41a09f3855da10089f2a\` FOREIGN KEY (\`babyInfoId\`) REFERENCES \`baby_infos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`baby_trackers\` ADD CONSTRAINT \`FK_9328c869534975246fa8511566d\` FOREIGN KEY (\`momInfoId\`) REFERENCES \`mom_infos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`baby_trackers\` DROP FOREIGN KEY \`FK_9328c869534975246fa8511566d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`baby_trackers\` DROP FOREIGN KEY \`FK_5c4f38e41a09f3855da10089f2a\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_9328c869534975246fa8511566\` ON \`baby_trackers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_5c4f38e41a09f3855da10089f2\` ON \`baby_trackers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_8994c7be87ad26dccc642df221\` ON \`baby_trackers\``,
    );
    await queryRunner.query(`DROP TABLE \`baby_trackers\``);
  }
}
