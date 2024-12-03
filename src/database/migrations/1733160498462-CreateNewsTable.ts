import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewsTable1733160498462 implements MigrationInterface {
    name = 'CreateNewsTable1733160498462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`news\` (\`id\` int NOT NULL AUTO_INCREMENT, \`authorId\` int NOT NULL, \`thumbnailUrl\` varchar(255) NULL, \`title\` text NOT NULL, \`description\` text NULL, \`url\` varchar(255) NOT NULL, \`views\` int NOT NULL DEFAULT '0', \`isPublished\` tinyint NOT NULL DEFAULT 1, \`publishedAt\` timestamp NULL DEFAULT CURRENT_TIMESTAMP, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`categoryId\` int NOT NULL, FULLTEXT INDEX \`IDX_b741244d1049e2eec7c0065fa9\` (\`title\`), FULLTEXT INDEX \`IDX_363d33b061c48df134b4f5ad37\` (\`description\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`news\` ADD CONSTRAINT \`FK_12a76d9b0f635084194b2c6aa01\` FOREIGN KEY (\`categoryId\`) REFERENCES \`new_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`news\` DROP FOREIGN KEY \`FK_12a76d9b0f635084194b2c6aa01\``);
        await queryRunner.query(`DROP INDEX \`IDX_363d33b061c48df134b4f5ad37\` ON \`news\``);
        await queryRunner.query(`DROP INDEX \`IDX_b741244d1049e2eec7c0065fa9\` ON \`news\``);
        await queryRunner.query(`DROP TABLE \`news\``);
    }

}
