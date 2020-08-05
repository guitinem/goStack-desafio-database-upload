import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTransactionTable1596586551307 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          }
        ]
      }));

    await queryRunner.createForeignKey('transaction', new TableForeignKey({
      name: 'TransactionCategory',
      columnNames: ['category_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'category',
      onDelete:'SET NULL',
      onUpdate: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transaction', 'TransactionCategory');

    await queryRunner.dropTable('transaction');
  }

}
