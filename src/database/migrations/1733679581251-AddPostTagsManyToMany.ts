import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostTagsManyToMany1733679581251 implements MigrationInterface {
    name = 'AddPostTagsManyToMany1733679581251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`post_tags\` (\`postsId\` int NOT NULL, \`tagsId\` int NOT NULL, INDEX \`IDX_e989388f06246063f9af179809\` (\`postsId\`), INDEX \`IDX_03dde65485412da025858f0305\` (\`tagsId\`), PRIMARY KEY (\`postsId\`, \`tagsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post_tags\` ADD CONSTRAINT \`FK_e989388f06246063f9af1798098\` FOREIGN KEY (\`postsId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_tags\` ADD CONSTRAINT \`FK_03dde65485412da025858f03051\` FOREIGN KEY (\`tagsId\`) REFERENCES \`tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_tags\` DROP FOREIGN KEY \`FK_03dde65485412da025858f03051\``);
        await queryRunner.query(`ALTER TABLE \`post_tags\` DROP FOREIGN KEY \`FK_e989388f06246063f9af1798098\``);
        await queryRunner.query(`DROP INDEX \`IDX_03dde65485412da025858f0305\` ON \`post_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_e989388f06246063f9af179809\` ON \`post_tags\``);
        await queryRunner.query(`DROP TABLE \`post_tags\``);
    }

}
