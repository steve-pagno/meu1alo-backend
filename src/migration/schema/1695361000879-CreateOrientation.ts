import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrientation1695361000879 implements MigrationInterface {
    name = 'CreateOrientation1695361000879';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `orientacao` (`id_orientation` int NOT NULL AUTO_INCREMENT, `descricao` varchar(255) NOT NULL COMMENT \'Descreve a orientação\', `data_desativacao` date NULL COMMENT \'Data de desativação do equipamento\', PRIMARY KEY (`id_orientation`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `orientacao`');
    }

}
