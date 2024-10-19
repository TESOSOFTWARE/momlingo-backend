import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeAvatarUrlType1729337913721 implements MigrationInterface {
    name = 'ChangeAvatarUrlType1729337913721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatarUrl\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatarUrl\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`children\` DROP COLUMN \`avatarUrl\``);
        await queryRunner.query(`ALTER TABLE \`children\` ADD \`avatarUrl\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`children\` DROP COLUMN \`avatarUrl\``);
        await queryRunner.query(`ALTER TABLE \`children\` ADD \`avatarUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatarUrl\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatarUrl\` varchar(255) NULL`);
    }

}
