import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddValueFieldToTransaction1596666011523 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('transactions', new TableColumn({
      name: 'value',
      type: 'decimal',
      precision: 10,
      scale: 2,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'value');
  }

}
