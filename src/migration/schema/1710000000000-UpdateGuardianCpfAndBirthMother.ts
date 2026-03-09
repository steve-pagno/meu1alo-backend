import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class UpdateGuardianCpfAndBirthMother1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const guardianTable = await queryRunner.getTable('responsavel');
        if (!guardianTable) return;

        const hasCpf = guardianTable.columns.some((c) => c.name === 'cpf');
        if (!hasCpf) {
            await queryRunner.addColumn('responsavel', new TableColumn({
                name: 'cpf',
                type: 'varchar',
                length: '11',
                isNullable: true,
                comment: 'CPF do responsável',
            }));
        }

        const refreshedGuardianTable = await queryRunner.getTable('responsavel');
        const cpfUniqueIndexExists = refreshedGuardianTable?.indices.some(
            (idx) => idx.name === 'IDX_responsavel_cpf_unique'
        );

        if (!cpfUniqueIndexExists) {
            await queryRunner.createIndex('responsavel', new TableIndex({
                name: 'IDX_responsavel_cpf_unique',
                columnNames: ['cpf'],
                isUnique: true,
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const guardianTable = await queryRunner.getTable('responsavel');
        if (!guardianTable) return;

        const cpfUniqueIndex = guardianTable.indices.find(
            (idx) => idx.name === 'IDX_responsavel_cpf_unique'
        );

        if (cpfUniqueIndex) {
            await queryRunner.dropIndex('responsavel', cpfUniqueIndex);
        }

        const hasCpf = guardianTable.columns.some((c) => c.name === 'cpf');
        if (hasCpf) {
            await queryRunner.dropColumn('responsavel', 'cpf');
        }
    }
}