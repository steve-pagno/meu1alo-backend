import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CreateCache1695362633166 implements MigrationInterface {
    name = 'CreateCache1695362633166';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('email_servico_referencia', new TableColumn({
            comment: 'Endereço de email para contato', isUnique: true, length: '255',
            name: 'email', type: 'varchar'
        }), new TableColumn({
            comment: 'Endereço de email para contato', isUnique: false, length: '255',
            name: 'email', type: 'varchar'
        }));

        await queryRunner.changeColumn('email_secretaria', new TableColumn({
            comment: 'Endereço de email para contato', isUnique: true, length: '255',
            name: 'email', type: 'varchar'
        }), new TableColumn({
            comment: 'Endereço de email para contato', isUnique: false, length: '255',
            name: 'email', type: 'varchar'
        }));

        await queryRunner.changeColumn('email_responsavel', new TableColumn({
            comment: 'Endereço de email para contato', isUnique: true, length: '255',
            name: 'email', type: 'varchar'
        }), new TableColumn({
            comment: 'Endereço de email para contato', isUnique: false, length: '255',
            name: 'email', type: 'varchar'
        }));

        await queryRunner.changeColumn('email_instituicao', new TableColumn({
            comment: 'Endereço de email para contato', isUnique: true, length: '255',
            name: 'email', type: 'varchar'
        }), new TableColumn({
            comment: 'Endereço de email para contato', isUnique: false, length: '255',
            name: 'email', type: 'varchar'
        }));

        await queryRunner.changeColumn('email_fonoaudiologo', new TableColumn({
            comment: 'Endereço de email para contato', isUnique: true, length: '255',
            name: 'email', type: 'varchar'
        }), new TableColumn({
            comment: 'Endereço de email para contato', isUnique: false, length: '255',
            name: 'email', type: 'varchar'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('email_servico_referencia', new TableColumn({
            comment: 'Endereço de email para contato', isUnique: false, length: '255',
            name: 'email', type: 'varchar'
        }), new TableColumn({
            comment: 'Endereço de email para contato', isUnique: true, length: '255',
            name: 'email', type: 'varchar'
        }));

        await queryRunner.changeColumn('email_secretaria', new TableColumn({
            comment: 'Endereço de email para contato', isUnique: false, length: '255',
            name: 'email', type: 'varchar'
        }), new TableColumn({
            comment: 'Endereço de email para contato', isUnique: true, length: '255',
            name: 'email', type: 'varchar'
        }));

        await queryRunner.changeColumn('email_responsavel', new TableColumn({
            comment: 'Endereço de email para contato', isUnique: false, length: '255',
            name: 'email', type: 'varchar'
        }), new TableColumn({
            comment: 'Endereço de email para contato', isUnique: true, length: '255',
            name: 'email', type: 'varchar'
        }));

        await queryRunner.changeColumn('email_instituicao', new TableColumn({
            comment: 'Endereço de email para contato', isUnique: false, length: '255',
            name: 'email', type: 'varchar'
        }), new TableColumn({
            comment: 'Endereço de email para contato', isUnique: true, length: '255',
            name: 'email', type: 'varchar'
        }));

        await queryRunner.changeColumn('email_fonoaudiologo', new TableColumn({
            comment: 'Endereço de email para contato', isUnique: false, length: '255',
            name: 'email', type: 'varchar'
        }), new TableColumn({
            comment: 'Endereço de email para contato', isUnique: true, length: '255',
            name: 'email', type: 'varchar'
        }));
    }

}
