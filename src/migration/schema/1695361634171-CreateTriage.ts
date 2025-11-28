import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriage1695361634171 implements MigrationInterface {
    name = 'CreateTriage1695361634171';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `triagem` (`id_triagem` int NOT NULL AUTO_INCREMENT, `orelha_esquerda` tinyint NOT NULL COMMENT \'Se a orelha esquerda passou no teste\', `orelha_direita` tinyint NOT NULL COMMENT \'Se a orelha direita passou no teste\', `data_avaliacao` datetime NOT NULL COMMENT \'Data em que foi feito a avaliação)\', `tipo_triagem` enum (\'EOE transitente\', \'EOE produto de distorção\', \'PEATE automático\', \'EOE transitente + PEATE automático\') NOT NULL COMMENT \'Tipo de triagem\', `observacao` text NOT NULL COMMENT \'Qualquer tipo de observação sobre a triagem\', PRIMARY KEY (`id_triagem`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `triagem`');
    }

}
