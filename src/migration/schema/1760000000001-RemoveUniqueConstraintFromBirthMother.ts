import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class RemoveUniqueConstraintFromBirthMother1760000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('bebe');
        if (!table) {
            return;
        }

        // 1. Drop REL_05c2dbd5574e98c267b3b80645 if it exists
        const relIndex = table.indices.find(idx => idx.name === 'REL_05c2dbd5574e98c267b3b80645');
        if (relIndex) {
            await queryRunner.dropIndex('bebe', relIndex);
        }

        // 2. Drop IDX_05c2dbd5574e98c267b3b80645 if it exists
        const idxIndex = table.indices.find(idx => idx.name === 'IDX_05c2dbd5574e98c267b3b80645');
        if (idxIndex) {
            await queryRunner.dropIndex('bebe', idxIndex);
        }

        // 3. Create the non-unique index for lookup performance
        const hasIndex = table.indices.some(idx => idx.name === 'IDX_bebe_fk_mae_bio_non_unique');
        if (!hasIndex) {
            await queryRunner.createIndex('bebe', new TableIndex({
                columnNames: ['fk_mae_bio'],
                isUnique: false,
                name: 'IDX_bebe_fk_mae_bio_non_unique',
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('bebe');
        if (!table) {
            return;
        }

        // 1. Drop the non-unique index
        const nonUniqueIndex = table.indices.find(idx => idx.name === 'IDX_bebe_fk_mae_bio_non_unique');
        if (nonUniqueIndex) {
            await queryRunner.dropIndex('bebe', nonUniqueIndex);
        }

        // 2. Re-create the unique indexes
        await queryRunner.createIndex('bebe', new TableIndex({
            columnNames: ['fk_mae_bio'],
            isUnique: true,
            name: 'IDX_05c2dbd5574e98c267b3b80645',
        }));

        await queryRunner.createIndex('bebe', new TableIndex({
            columnNames: ['fk_mae_bio'],
            isUnique: true,
            name: 'REL_05c2dbd5574e98c267b3b80645',
        }));
    }
}
