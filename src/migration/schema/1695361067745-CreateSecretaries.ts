import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSecretaries1695361067745 implements MigrationInterface {
    name = 'CreateSecretaries1695361067745';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `regiao` (`id_regiao` int NOT NULL AUTO_INCREMENT, `data_cadastro` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL, `fk_estado` int NOT NULL, `secretaria_nome` varchar(255) NULL COMMENT \'Rua em que se encontra esse endereço\', `secretaria_emails` text NULL COMMENT \'Endereços de email para contato\', PRIMARY KEY (`id_regiao`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `email_secretaria` (`id_email` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primaria de um email\', `email` varchar(255) NOT NULL COMMENT \'Endereço de email para contato\', `is_principal` tinyint NOT NULL COMMENT \'Marca o email principal da conta\' DEFAULT 0, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do email\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o email foi inativado nessa data\', `fk_usuario` int NOT NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', UNIQUE INDEX `IDX_7be91b49157d8838ca8a0bd0ac` (`email`), PRIMARY KEY (`id_email`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `tel_secretaria` (`id_tel` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primaria de um telefone\', `numero` varchar(15) NOT NULL COMMENT \'Número do telefone, DDD + número\', `nome_contato` varchar(45) NULL COMMENT \'Nome do contato do número telefonico\', `is_whatsapp` tinyint NOT NULL COMMENT \'Diz se o número tem uma conta no whatsapp\' DEFAULT 0, `is_principal` tinyint NOT NULL COMMENT \'Marca o telefone principal da conta\' DEFAULT 0, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do telefone\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o telefone foi inativado nessa data\', `fk_secretaria` int NOT NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', PRIMARY KEY (`id_tel`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `usuario_secretaria` (`id_usuario` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', `login` varchar(255) NOT NULL COMMENT \'Login do usuário, definido pelo user, exceto pais que é gerado pelo sistema\', `password` varchar(255) NOT NULL COMMENT \'password do usuário\', `resetar_senha` tinyint NOT NULL COMMENT \'Força a mudança de senha no próximo login\' DEFAULT 0, `nome_usuario` varchar(255) NOT NULL COMMENT \'Nome do usuário\', `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do usuário\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o usuário foi inativado nessa data\', `cargo` varchar(255) NULL COMMENT \'Cargo\', `fk_secretaria_estado` int NULL, `fk_secretaria_regiao` int NULL, UNIQUE INDEX `IDX_598ea50144fd99f2795c01c877` (`login`), PRIMARY KEY (`id_usuario`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `estado` (`id_estado` int NOT NULL AUTO_INCREMENT, `codigo_ibge` int NOT NULL, `nome` varchar(20) NOT NULL, `uf` varchar(2) NOT NULL, `secretaria_nome` varchar(255) NULL COMMENT \'Rua em que se encontra esse endereço\', `secretaria_emails` text NULL COMMENT \'Endereços de email para contato\', UNIQUE INDEX `IDX_002b78d13edfb2d040f9b4eced` (`codigo_ibge`), UNIQUE INDEX `IDX_97755db4b1b5aebf5275143e9b` (`uf`), PRIMARY KEY (`id_estado`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `municipio` (`id_municipio` int NOT NULL AUTO_INCREMENT, `nome` varchar(48) NOT NULL, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do município\' DEFAULT CURRENT_TIMESTAMP(6), `fk_regiao` int NULL, `fk_state` int NOT NULL, PRIMARY KEY (`id_municipio`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `regiao` ADD CONSTRAINT `FK_eda3deae3e311892ea17a144cd8` FOREIGN KEY (`fk_estado`) REFERENCES `estado`(`id_estado`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `email_secretaria` ADD CONSTRAINT `FK_7fce7ce9ab351d900273f01dae5` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario_secretaria`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `tel_secretaria` ADD CONSTRAINT `FK_b4e4c0123728ef13ad060cbf1a3` FOREIGN KEY (`fk_secretaria`) REFERENCES `usuario_secretaria`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `usuario_secretaria` ADD CONSTRAINT `FK_eda65607580b1c279c6cd43f7b4` FOREIGN KEY (`fk_secretaria_estado`) REFERENCES `estado`(`id_estado`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `usuario_secretaria` ADD CONSTRAINT `FK_52b786b3619332df99cb60cf8ef` FOREIGN KEY (`fk_secretaria_regiao`) REFERENCES `regiao`(`id_regiao`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `municipio` ADD CONSTRAINT `FK_fea5bb63901e034be0275ee274a` FOREIGN KEY (`fk_regiao`) REFERENCES `regiao`(`id_regiao`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `municipio` ADD CONSTRAINT `FK_bb8c58fa88607524fae8a9c003c` FOREIGN KEY (`fk_state`) REFERENCES `estado`(`id_estado`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `municipio` DROP FOREIGN KEY `FK_bb8c58fa88607524fae8a9c003c`');
        await queryRunner.query('ALTER TABLE `municipio` DROP FOREIGN KEY `FK_fea5bb63901e034be0275ee274a`');
        await queryRunner.query('ALTER TABLE `usuario_secretaria` DROP FOREIGN KEY `FK_52b786b3619332df99cb60cf8ef`');
        await queryRunner.query('ALTER TABLE `usuario_secretaria` DROP FOREIGN KEY `FK_eda65607580b1c279c6cd43f7b4`');
        await queryRunner.query('ALTER TABLE `tel_secretaria` DROP FOREIGN KEY `FK_b4e4c0123728ef13ad060cbf1a3`');
        await queryRunner.query('ALTER TABLE `email_secretaria` DROP FOREIGN KEY `FK_7fce7ce9ab351d900273f01dae5`');
        await queryRunner.query('ALTER TABLE `regiao` DROP FOREIGN KEY `FK_eda3deae3e311892ea17a144cd8`');
        await queryRunner.query('DROP TABLE `municipio`');
        await queryRunner.query('DROP INDEX `IDX_97755db4b1b5aebf5275143e9b` ON `estado`');
        await queryRunner.query('DROP INDEX `IDX_002b78d13edfb2d040f9b4eced` ON `estado`');
        await queryRunner.query('DROP TABLE `estado`');
        await queryRunner.query('DROP INDEX `IDX_598ea50144fd99f2795c01c877` ON `usuario_secretaria`');
        await queryRunner.query('DROP TABLE `usuario_secretaria`');
        await queryRunner.query('DROP TABLE `tel_secretaria`');
        await queryRunner.query('DROP INDEX `IDX_7be91b49157d8838ca8a0bd0ac` ON `email_secretaria`');
        await queryRunner.query('DROP TABLE `email_secretaria`');
        await queryRunner.query('DROP TABLE `regiao`');
    }

}
