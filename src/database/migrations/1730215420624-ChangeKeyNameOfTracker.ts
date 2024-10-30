import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeKeyNameOfTracker1730215420624 implements MigrationInterface {
    name = 'ChangeKeyNameOfTracker1730215420624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mom_infos\` CHANGE \`thumbnail3D\` \`thumbnail3DUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`baby_infos\` CHANGE \`thumbnail3D\` \`thumbnail3DUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`baby_infos\` CHANGE \`height\` \`high\` double NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`mom_infos\``);
        await queryRunner.query(`DROP TABLE \`baby_infos\``);
    }

}
