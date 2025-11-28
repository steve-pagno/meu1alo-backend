import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInstitution1695361344706 implements MigrationInterface {
    name = 'CreateInstitution1695361344706';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `instituicao` (`id_instituicao` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primária da instituição\', `nome_instituicao` varchar(255) NOT NULL COMMENT \'Nome instituição\', `cnes` varchar(11) NOT NULL COMMENT \'CNES\', `cnpj` varchar(14) NULL COMMENT \'CNPJ\', `tipo_instituicao` enum (\'Hospital\', \'Maternidade\', \'Hospital e Maternidade\') NOT NULL COMMENT \'Tipo de Instituição\', PRIMARY KEY (`id_instituicao`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `tel_instituicao` (`id_tel` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primaria de um telefone\', `numero` varchar(15) NOT NULL COMMENT \'Número do telefone, DDD + número\', `nome_contato` varchar(45) NULL COMMENT \'Nome do contato do número telefonico\', `is_whatsapp` tinyint NOT NULL COMMENT \'Diz se o número tem uma conta no whatsapp\' DEFAULT 0, `is_principal` tinyint NOT NULL COMMENT \'Marca o telefone principal da conta\' DEFAULT 0, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do telefone\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o telefone foi inativado nessa data\', `fk_instituicao` int NOT NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', PRIMARY KEY (`id_tel`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `usuario_instituicao` (`id_usuario` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', `login` varchar(255) NOT NULL COMMENT \'Login do usuário, definido pelo user, exceto pais que é gerado pelo sistema\', `password` varchar(255) NOT NULL COMMENT \'password do usuário\', `resetar_senha` tinyint NOT NULL COMMENT \'Força a mudança de senha no próximo login\' DEFAULT 0, `nome_usuario` varchar(255) NOT NULL COMMENT \'Nome do usuário\', `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do usuário\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o usuário foi inativado nessa data\', `cargo` varchar(255) NULL COMMENT \'Cargo\', `fk_instituicao` int NOT NULL COMMENT \'Chave primária da instituição\', UNIQUE INDEX `IDX_ed675152693ba21f7728bf4cb8` (`login`), PRIMARY KEY (`id_usuario`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `email_instituicao` (`id_email` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primaria de um email\', `email` varchar(255) NOT NULL COMMENT \'Endereço de email para contato\', `is_principal` tinyint NOT NULL COMMENT \'Marca o email principal da conta\' DEFAULT 0, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do email\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o email foi inativado nessa data\', `fk_instituicao` int NOT NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', UNIQUE INDEX `IDX_6052810a1e0b920584f9ec89c1` (`email`), PRIMARY KEY (`id_email`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `tel_instituicao` ADD CONSTRAINT `FK_e46e5b2959d12692338115e256c` FOREIGN KEY (`fk_instituicao`) REFERENCES `usuario_instituicao`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `usuario_instituicao` ADD CONSTRAINT `FK_95a9899ccce8f07dff2f523873e` FOREIGN KEY (`fk_instituicao`) REFERENCES `instituicao`(`id_instituicao`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `email_instituicao` ADD CONSTRAINT `FK_21a0043c93e1a2bc7d318d94000` FOREIGN KEY (`fk_instituicao`) REFERENCES `usuario_instituicao`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `email_instituicao` DROP FOREIGN KEY `FK_21a0043c93e1a2bc7d318d94000`');
        await queryRunner.query('ALTER TABLE `usuario_instituicao` DROP FOREIGN KEY `FK_95a9899ccce8f07dff2f523873e`');
        await queryRunner.query('ALTER TABLE `tel_instituicao` DROP FOREIGN KEY `FK_e46e5b2959d12692338115e256c`');
        await queryRunner.query('DROP INDEX `IDX_6052810a1e0b920584f9ec89c1` ON `email_instituicao`');
        await queryRunner.query('DROP TABLE `email_instituicao`');
        await queryRunner.query('DROP INDEX `IDX_ed675152693ba21f7728bf4cb8` ON `usuario_instituicao`');
        await queryRunner.query('DROP TABLE `usuario_instituicao`');
        await queryRunner.query('DROP TABLE `tel_instituicao`');
        await queryRunner.query('DROP TABLE `instituicao`');
    }

}
