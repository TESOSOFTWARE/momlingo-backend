import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMusicCategoriesAndSongsReleationship1732190592538 implements MigrationInterface {
    name = 'AddMusicCategoriesAndSongsReleationship1732190592538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`music_songs\` ADD \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`music_songs\` ADD CONSTRAINT \`FK_94c215d16062eb3304c3bf538a6\` FOREIGN KEY (\`categoryId\`) REFERENCES \`music_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`music_songs\` DROP FOREIGN KEY \`FK_94c215d16062eb3304c3bf538a6\``);
        await queryRunner.query(`ALTER TABLE \`music_songs\` DROP COLUMN \`categoryId\``);
    }

}
