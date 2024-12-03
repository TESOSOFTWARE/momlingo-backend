import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChecklistTable1733241511354 implements MigrationInterface {
    name = 'CreateChecklistTable1733241511354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`checklists\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`taskGroupType\` enum ('0', '1', '2', '3', '4', '5') NOT NULL DEFAULT '5', \`startDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`endDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`checklists\``);
    }

}
