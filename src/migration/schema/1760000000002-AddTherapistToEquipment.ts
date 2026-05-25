import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTherapistToEquipment1760000000002 implements MigrationInterface {
    name = 'AddTherapistToEquipment1760000000002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE equipamento
                ADD COLUMN fk_fonoaudiologo INT NULL,
                ADD CONSTRAINT FK_equipamento_fonoaudiologo FOREIGN KEY (fk_fonoaudiologo) REFERENCES fonoaudiologo(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE equipamento
                DROP FOREIGN KEY FK_equipamento_fonoaudiologo
        `);
        await queryRunner.query(`
            ALTER TABLE equipamento
                DROP COLUMN fk_fonoaudiologo
        `);
    }
}
