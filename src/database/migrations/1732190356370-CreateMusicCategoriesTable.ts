import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMusicCategoriesTable1732190356370 implements MigrationInterface {
    name = 'CreateMusicCategoriesTable1732190356370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`music_categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`thumbnailUrl\` text NOT NULL, \`type\` enum ('normal', 'popular') NOT NULL DEFAULT 'normal', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`music_categories\``);
    }

}
