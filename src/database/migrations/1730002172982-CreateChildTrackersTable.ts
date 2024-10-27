import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChildTrackersTable1730002172982 implements MigrationInterface {
    name = 'CreateChildTrackersTable1730002172982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`child-trackers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`week\` int NOT NULL, \`content\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e5e6126889ca1af13b1a09e1ae\` (\`week\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e5e6126889ca1af13b1a09e1ae\` ON \`child-trackers\``);
        await queryRunner.query(`DROP TABLE \`child-trackers\``);
    }

}
