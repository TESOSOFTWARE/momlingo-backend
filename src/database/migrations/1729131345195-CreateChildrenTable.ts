import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChildrenTable1729131345195 implements MigrationInterface {
    name = 'CreateChildrenTable1729131345195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`children\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`nickname\` varchar(255) NOT NULL, \`avatarUrl\` varchar(255) NULL, \`dateOfBirth\` timestamp NOT NULL, \`gender\` enum ('male', 'female') NOT NULL DEFAULT 'female', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_38d64b9af722eb4e86f8922406\` (\`name\`), INDEX \`IDX_82b5ebb044a0b981444f017527\` (\`nickname\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_82b5ebb044a0b981444f017527\` ON \`children\``);
        await queryRunner.query(`DROP INDEX \`IDX_38d64b9af722eb4e86f8922406\` ON \`children\``);
        await queryRunner.query(`DROP TABLE \`children\``);
    }

}
