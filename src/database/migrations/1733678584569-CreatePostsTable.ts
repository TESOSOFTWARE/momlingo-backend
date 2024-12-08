import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostsTable1733678584569 implements MigrationInterface {
    name = 'CreatePostsTable1733678584569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`userId\` int NOT NULL, \`status\` enum ('public', 'private') NOT NULL DEFAULT 'public', \`enableComment\` tinyint NOT NULL DEFAULT 1, \`likesCount\` int NOT NULL DEFAULT '0', \`commentsCount\` int NOT NULL DEFAULT '0', \`savesCount\` int NOT NULL DEFAULT '0', \`viewsCount\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), FULLTEXT INDEX \`IDX_72af15d4745203c77905a7ab2a\` (\`content\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``);
        await queryRunner.query(`DROP INDEX \`IDX_72af15d4745203c77905a7ab2a\` ON \`posts\``);
        await queryRunner.query(`DROP TABLE \`posts\``);
    }

}
