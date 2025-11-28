import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndicator1695360916569 implements MigrationInterface {
    name = 'CreateIndicator1695360916569';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `indicador_risco` (`id_indicador_risco` int NOT NULL AUTO_INCREMENT, `nome` varchar(255) NOT NULL COMMENT \'Nome do indicador de risco\', PRIMARY KEY (`id_indicador_risco`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `indicador_risco`');
    }

}
