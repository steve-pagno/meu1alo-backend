import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CreateCache1695362633165 implements MigrationInterface {
    name = 'CreateCache1695362633165';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('servico_referencia', new TableColumn({
            length: '7', name: 'cnes', type: 'varchar'
        }), new TableColumn({
            length: '11', name: 'cnes', type: 'varchar'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('servico_referencia', new TableColumn({
            length: '11', name: 'cnes', type: 'varchar'
        }), new TableColumn({
            length: '7', name: 'cnes', type: 'varchar'
        }));
    }

}
