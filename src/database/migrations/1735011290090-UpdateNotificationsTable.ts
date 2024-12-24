import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNotificationsTable1735011290090 implements MigrationInterface {
    name = 'UpdateNotificationsTable1735011290090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_44412a2d6f162ff4dc1697d0db7\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_93c464aaf70fb0720dc500e93c8\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`actorId\` \`actorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`postId\` \`postId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_44412a2d6f162ff4dc1697d0db7\` FOREIGN KEY (\`actorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_93c464aaf70fb0720dc500e93c8\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_93c464aaf70fb0720dc500e93c8\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_44412a2d6f162ff4dc1697d0db7\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`postId\` \`postId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`actorId\` \`actorId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_93c464aaf70fb0720dc500e93c8\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_44412a2d6f162ff4dc1697d0db7\` FOREIGN KEY (\`actorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
