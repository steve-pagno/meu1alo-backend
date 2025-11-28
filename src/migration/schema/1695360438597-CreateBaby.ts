import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBaby1695360438597 implements MigrationInterface {
    name = 'CreateBaby1695360438597';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `bebe` (`id_bebe` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primária do bebê\', `nome` varchar(255) NOT NULL COMMENT \'Nome\', `peso` float NOT NULL COMMENT \'Peso do bebê\', `altura` float NOT NULL COMMENT \'Altura do bebê\', `circunferencia` float NOT NULL COMMENT \'Circunferência da cabeça do bebê\', `data_nascimento` datetime NOT NULL COMMENT \'Data de nascimento do responsável (para cálculo de idade e afins)\', `idade_gestacional` int NOT NULL COMMENT \'Tempo de duração da gestação do bebê marcado em semanas\', `tipo_parto` enum (\'Parto Cirúrgico (Cesárea)\', \'Parto Vaginal Natural\', \'Parto Vaginal com Extrator a vácuo\', \'Parto Vaginal com Fórceps\', \'Parto na água\') NOT NULL COMMENT \'Tipo do parto do bebê\', `obito_materno` tinyint NOT NULL COMMENT \'Obito materno\', `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do bebê\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o serviço de referencia foi inativado nessa data\', PRIMARY KEY (`id_bebe`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `bebe`');
    }

}
