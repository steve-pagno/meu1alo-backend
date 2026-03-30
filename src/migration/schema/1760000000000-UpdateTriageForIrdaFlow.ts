import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTriageForIrdaFlow1760000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE triagem
                ADD COLUMN eoa_orelha_esquerda TINYINT NULL,
                ADD COLUMN eoa_orelha_direita TINYINT NULL,
                ADD COLUMN peatea_orelha_esquerda TINYINT NULL,
                ADD COLUMN peatea_orelha_direita TINYINT NULL
        `);

        await queryRunner.query(`
            UPDATE triagem
            SET eoa_orelha_esquerda = orelha_esquerda,
                eoa_orelha_direita = orelha_direita
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE triagem
                DROP COLUMN eoa_orelha_esquerda,
                DROP COLUMN eoa_orelha_direita,
                DROP COLUMN peatea_orelha_esquerda,
                DROP COLUMN peatea_orelha_direita
        `);
    }
}