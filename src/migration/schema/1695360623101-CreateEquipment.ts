import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEquipment1695360623101 implements MigrationInterface {
    name = 'CreateEquipment1695360623101';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `equipamento` (`id_equipamento` int NOT NULL AUTO_INCREMENT, `modelo` varchar(255) NOT NULL COMMENT \'Modelo do equipamento\', `marca` varchar(255) NOT NULL COMMENT \'Marca do equipamento\', `data_calibracao` date NOT NULL COMMENT \'Data do último calibramento do equipamento\', `data_desativacao` date NULL COMMENT \'Data de desativação do equipamento\', PRIMARY KEY (`id_equipamento`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `equipamento`');
    }

}
