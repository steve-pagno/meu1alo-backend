import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGuardian1695361265147 implements MigrationInterface {
    name = 'CreateGuardian1695361265147';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `tel_responsavel` (`id_tel` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primaria de um telefone\', `numero` varchar(15) NOT NULL COMMENT \'Número do telefone, DDD + número\', `nome_contato` varchar(45) NULL COMMENT \'Nome do contato do número telefonico\', `is_whatsapp` tinyint NOT NULL COMMENT \'Diz se o número tem uma conta no whatsapp\' DEFAULT 0, `is_principal` tinyint NOT NULL COMMENT \'Marca o telefone principal da conta\' DEFAULT 0, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do telefone\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o telefone foi inativado nessa data\', `fk_responsavel` int NOT NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', PRIMARY KEY (`id_tel`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `responsavel` (`id_usuario` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', `login` varchar(255) NOT NULL COMMENT \'Login do usuário, definido pelo user, exceto pais que é gerado pelo sistema\', `password` varchar(255) NOT NULL COMMENT \'password do usuário\', `resetar_senha` tinyint NOT NULL COMMENT \'Força a mudança de senha no próximo login\' DEFAULT 0, `nome_usuario` varchar(255) NOT NULL COMMENT \'Nome do usuário\', `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do usuário\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o usuário foi inativado nessa data\', `data_nascimento` date NOT NULL COMMENT \'Data de nascimento do responsável (para cálculo de idade e afins)\', `cpf` varchar(11) NULL COMMENT \'CPF do responsável\', UNIQUE INDEX `IDX_221edfd9792f27aac69cda983a` (`login`), PRIMARY KEY (`id_usuario`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `email_responsavel` (`id_email` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primaria de um email\', `email` varchar(255) NOT NULL COMMENT \'Endereço de email para contato\', `is_principal` tinyint NOT NULL COMMENT \'Marca o email principal da conta\' DEFAULT 0, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do email\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o email foi inativado nessa data\', `fk_responsavel` int NOT NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', UNIQUE INDEX `IDX_34f1e858a86d2a2397ccb7af9b` (`email`), PRIMARY KEY (`id_email`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `tel_responsavel` ADD CONSTRAINT `FK_4fcfd91762f182b28fb02eccf8c` FOREIGN KEY (`fk_responsavel`) REFERENCES `responsavel`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `email_responsavel` ADD CONSTRAINT `FK_44688b0e148ecf48ec20b3088f8` FOREIGN KEY (`fk_responsavel`) REFERENCES `responsavel`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `email_responsavel` DROP FOREIGN KEY `FK_44688b0e148ecf48ec20b3088f8`');
        await queryRunner.query('ALTER TABLE `tel_responsavel` DROP FOREIGN KEY `FK_4fcfd91762f182b28fb02eccf8c`');
        await queryRunner.query('DROP INDEX `IDX_34f1e858a86d2a2397ccb7af9b` ON `email_responsavel`');
        await queryRunner.query('DROP TABLE `email_responsavel`');
        await queryRunner.query('DROP INDEX `IDX_221edfd9792f27aac69cda983a` ON `responsavel`');
        await queryRunner.query('DROP TABLE `responsavel`');
        await queryRunner.query('DROP TABLE `tel_responsavel`');
    }

}
