import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMomInfosTable1730000461938 implements MigrationInterface {
    name = 'CreateMomInfosTable1730000461938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`mom_infos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`week\` int NOT NULL, \`thumbnail3D\` varchar(255) NULL, \`image3DUrl\` varchar(255) NULL, \`symptoms\` text NULL, \`thingsTodo\` text NULL, \`thingsToAvoid\` text NULL, UNIQUE INDEX \`IDX_093f6752898a0d3fdd4c466a62\` (\`week\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_093f6752898a0d3fdd4c466a62\` ON \`mom_infos\``);
        await queryRunner.query(`DROP TABLE \`mom_infos\``);
    }

}
