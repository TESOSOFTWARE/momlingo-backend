import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMusicSongsTable1732190514195 implements MigrationInterface {
    name = 'CreateMusicSongsTable1732190514195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`music_songs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`artist\` varchar(255) NOT NULL, \`fileUrl\` varchar(255) NOT NULL, \`description\` text NOT NULL, INDEX \`IDX_9671d20bdf75b2fb613bc1de17\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_9671d20bdf75b2fb613bc1de17\` ON \`music_songs\``);
        await queryRunner.query(`DROP TABLE \`music_songs\``);
    }

}
