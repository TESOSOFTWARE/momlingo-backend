import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateForeignKeyOnDeleteCascadeOfChecklist1733247831832 implements MigrationInterface {
  name = 'UpdateForeignKeyOnDeleteCascadeOfChecklist1733247831832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Xóa constraint cũ (nếu đã tồn tại)
    await queryRunner.query(`ALTER TABLE \`checklist-items\` DROP FOREIGN KEY \`FK_5c804b006b500b60fd705ab0aec\``);

    // Thêm lại constraint mới với ON DELETE CASCADE
    await queryRunner.query(`
            ALTER TABLE \`checklist-items\`
            ADD CONSTRAINT \`FK_5c804b006b500b60fd705ab0aec\`
            FOREIGN KEY (\`checklistId\`)
            REFERENCES \`checklists\`(\`id\`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa constraint nếu rollback
    await queryRunner.query(`ALTER TABLE \`checklist-items\` DROP FOREIGN KEY \`FK_5c804b006b500b60fd705ab0aec\``);
  }
}
