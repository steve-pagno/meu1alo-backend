import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReferralService1695361435420 implements MigrationInterface {
    name = 'CreateReferralService1695361435420';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `email_servico_referencia` (`id_email` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primaria de um email\', `email` varchar(255) NOT NULL COMMENT \'Endereço de email para contato\', `is_principal` tinyint NOT NULL COMMENT \'Marca o email principal da conta\' DEFAULT 0, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do email\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o email foi inativado nessa data\', `fk_servico` int NOT NULL COMMENT \'Chave primária do servico de referencia\', UNIQUE INDEX `IDX_41663cddfe8b58a6356d719ccd` (`email`), PRIMARY KEY (`id_email`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `tel_servico_referencia` (`id_tel` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primaria de um telefone\', `numero` varchar(15) NOT NULL COMMENT \'Número do telefone, DDD + número\', `nome_contato` varchar(45) NULL COMMENT \'Nome do contato do número telefonico\', `is_whatsapp` tinyint NOT NULL COMMENT \'Diz se o número tem uma conta no whatsapp\' DEFAULT 0, `is_principal` tinyint NOT NULL COMMENT \'Marca o telefone principal da conta\' DEFAULT 0, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do telefone\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o telefone foi inativado nessa data\', `fk_servico` int NOT NULL COMMENT \'Chave primária do servico de referencia\', PRIMARY KEY (`id_tel`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `servico_referencia` (`id_servico` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primária do servico de referencia\', `nome_servico` varchar(255) NOT NULL COMMENT \'Nome do Serviço\', `cnpj` varchar(13) NULL COMMENT \'CNPJ do servico de referencia\', `cnes` varchar(7) NULL, `tipo_servico` enum (\'Serviço do Sistema Único de Saúde(SUS)\', \'Serviço Privado\', \'Serviço Misto\') NOT NULL COMMENT \'Tipo de Serviço\', `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do serviço de referencia\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o serviço de referencia foi inativado nessa data\', PRIMARY KEY (`id_servico`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `email_servico_referencia` ADD CONSTRAINT `FK_315b71d40067a1be8d8fedf4369` FOREIGN KEY (`fk_servico`) REFERENCES `servico_referencia`(`id_servico`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `tel_servico_referencia` ADD CONSTRAINT `FK_b813f5f461c807672b102ac7dd9` FOREIGN KEY (`fk_servico`) REFERENCES `servico_referencia`(`id_servico`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `tel_servico_referencia` DROP FOREIGN KEY `FK_b813f5f461c807672b102ac7dd9`');
        await queryRunner.query('ALTER TABLE `email_servico_referencia` DROP FOREIGN KEY `FK_315b71d40067a1be8d8fedf4369`');
        await queryRunner.query('DROP TABLE `servico_referencia`');
        await queryRunner.query('DROP TABLE `tel_servico_referencia`');
        await queryRunner.query('DROP INDEX `IDX_41663cddfe8b58a6356d719ccd` ON `email_servico_referencia`');
        await queryRunner.query('DROP TABLE `email_servico_referencia`');
    }

}
