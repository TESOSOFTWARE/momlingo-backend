import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeChildrenColumn1729337534862 implements MigrationInterface {
    name = 'ChangeChildrenColumn1729337534862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`children\` DROP COLUMN \`dateOfBirth\``);
        await queryRunner.query(`ALTER TABLE \`children\` ADD \`dateOfBirth\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`children\` DROP COLUMN \`dateOfBirth\``);
        await queryRunner.query(`ALTER TABLE \`children\` ADD \`dateOfBirth\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

}
