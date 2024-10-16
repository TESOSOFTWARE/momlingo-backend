import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateUsersTable1729047086006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'partnerId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phoneNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'avatarUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'deviceId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'deviceToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: ['male', 'female'],
            default: `'female'`,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['admin', 'user', 'creator'],
            default: `'user'`,
          },
          {
            name: 'lan',
            type: 'enum',
            enum: ['vi', 'en'],
            default: `'vi'`,
          },
          {
            name: 'deviceType',
            type: 'enum',
            enum: ['android', 'ios', 'web', 'other'],
            default: `'android'`,
          },
          {
            name: 'loginType',
            type: 'enum',
            enum: ['email', 'google', 'facebook', 'apple'],
            default: `'email'`,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['partnerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL', // Hoặc 'CASCADE' tùy theo yêu cầu
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_PHONE_NUMBER',
        columnNames: ['phoneNumber'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('partnerId') !== -1,
    );
    await queryRunner.dropForeignKey('users', foreignKey);
    await queryRunner.dropIndex('users', 'IDX_USER_NAME');
    await queryRunner.dropIndex('users', 'IDX_USER_EMAIL');
    await queryRunner.dropIndex('users', 'IDX_USER_PHONE_NUMBER');
    await queryRunner.dropTable('users');
  }
}
