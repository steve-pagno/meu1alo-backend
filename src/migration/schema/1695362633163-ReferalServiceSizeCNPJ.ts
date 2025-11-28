import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CreateCache1695362633163 implements MigrationInterface {
    name = 'CreateCache1695362633163';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('servico_referencia', new TableColumn({
            comment: 'CNPJ do servico de referencia', length: '13', name: 'cnpj',
            type: 'varchar',
        }), new TableColumn({
            comment: 'CNPJ do servico de referencia', length: '14', name: 'cnpj',
            type: 'varchar'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('servico_referencia', new TableColumn({
            comment: 'CNPJ do servico de referencia', length: '14', name: 'cnpj',
            type: 'varchar',
        }), new TableColumn({
            comment: 'CNPJ do servico de referencia', length: '13', name: 'cnpj',
            type: 'varchar',
        }));
    }

}
