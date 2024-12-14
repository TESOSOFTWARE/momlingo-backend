import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCheckListItemsTable1734175717749 implements MigrationInterface {
    name = 'UpdateCheckListItemsTable1734175717749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`checklist-items\` DROP FOREIGN KEY \`FK_5c804b006b500b60fd705ab0aec\``);
        await queryRunner.query(`ALTER TABLE \`checklist-items\` ADD CONSTRAINT \`FK_5c804b006b500b60fd705ab0aec\` FOREIGN KEY (\`checklistId\`) REFERENCES \`checklists\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`checklist-items\` DROP FOREIGN KEY \`FK_5c804b006b500b60fd705ab0aec\``);
        await queryRunner.query(`ALTER TABLE \`checklist-items\` ADD CONSTRAINT \`FK_5c804b006b500b60fd705ab0aec\` FOREIGN KEY (\`checklistId\`) REFERENCES \`checklists\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
