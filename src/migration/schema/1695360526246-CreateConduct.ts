import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConduct1695360526246 implements MigrationInterface {
    name = 'CreateConduct1695360526246';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `conduta` (`id_conduct` int NOT NULL AUTO_INCREMENT, `descricao_resultado` text NOT NULL COMMENT \'Descrição da conduta\', `descricao_acompanhamento` text NOT NULL COMMENT \'Descrição do acompanhamento\', `orelha_esquerda` tinyint NOT NULL COMMENT \'Se a orelha esquerda passou no teste\', `orelha_direita` tinyint NOT NULL COMMENT \'Se a orelha direita passou no teste\', `irda` tinyint NOT NULL COMMENT \'Se o a conduta está relacionada com o irda\', `tipo_teste` int NOT NULL COMMENT \'Se é relacionado ao teste, reteste e teste e reteste\', PRIMARY KEY (`id_conduct`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `conduta`');
    }

}
