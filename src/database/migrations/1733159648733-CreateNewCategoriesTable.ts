import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewCategoriesTable1733159648733 implements MigrationInterface {
    name = 'CreateNewCategoriesTable1733159648733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`new_categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`new_categories\``);
    }

}
