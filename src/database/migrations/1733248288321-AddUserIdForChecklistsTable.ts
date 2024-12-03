import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdForChecklistsTable1733248288321 implements MigrationInterface {
    name = 'AddUserIdForChecklistsTable1733248288321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`checklist-items\` DROP FOREIGN KEY \`FK_5c804b006b500b60fd705ab0aec\``);
        await queryRunner.query(`ALTER TABLE \`checklists\` ADD \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`checklist-items\` ADD CONSTRAINT \`FK_5c804b006b500b60fd705ab0aec\` FOREIGN KEY (\`checklistId\`) REFERENCES \`checklists\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`checklist-items\` DROP FOREIGN KEY \`FK_5c804b006b500b60fd705ab0aec\``);
        await queryRunner.query(`ALTER TABLE \`checklists\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`checklist-items\` ADD CONSTRAINT \`FK_5c804b006b500b60fd705ab0aec\` FOREIGN KEY (\`checklistId\`) REFERENCES \`checklists\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
