import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChecklistItemsTable1733241664086 implements MigrationInterface {
    name = 'CreateChecklistItemsTable1733241664086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`checklist-items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`status\` enum ('todo', 'progress', 'done') NOT NULL DEFAULT 'todo', \`planingDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`checklistId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`checklist-items\``);
    }

}
