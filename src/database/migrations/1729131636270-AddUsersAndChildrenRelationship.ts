import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersAndChildrenRelationship1729131636270 implements MigrationInterface {
    name = 'AddUsersAndChildrenRelationship1729131636270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`children\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`children\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

}
