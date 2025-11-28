import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTherapist1695361564079 implements MigrationInterface {
    name = 'CreateTherapist1695361564079';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `email_fonoaudiologo` (`id_email` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primaria de um email\', `email` varchar(255) NOT NULL COMMENT \'Endereço de email para contato\', `is_principal` tinyint NOT NULL COMMENT \'Marca o email principal da conta\' DEFAULT 0, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do email\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o email foi inativado nessa data\', `fk_fonoaudiologo` int NOT NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', UNIQUE INDEX `IDX_a9b0ce7b63e546a1f8b2f7196b` (`email`), PRIMARY KEY (`id_email`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `tel_fonoaudiologo` (`id_tel` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primaria de um telefone\', `numero` varchar(15) NOT NULL COMMENT \'Número do telefone, DDD + número\', `nome_contato` varchar(45) NULL COMMENT \'Nome do contato do número telefonico\', `is_whatsapp` tinyint NOT NULL COMMENT \'Diz se o número tem uma conta no whatsapp\' DEFAULT 0, `is_principal` tinyint NOT NULL COMMENT \'Marca o telefone principal da conta\' DEFAULT 0, `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do telefone\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o telefone foi inativado nessa data\', `fk_fonoaudiologo` int NOT NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', PRIMARY KEY (`id_tel`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `fonoaudiologo` (`id_usuario` int NOT NULL AUTO_INCREMENT COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\', `login` varchar(255) NOT NULL COMMENT \'Login do usuário, definido pelo user, exceto pais que é gerado pelo sistema\', `password` varchar(255) NOT NULL COMMENT \'password do usuário\', `resetar_senha` tinyint NOT NULL COMMENT \'Força a mudança de senha no próximo login\' DEFAULT 0, `nome_usuario` varchar(255) NOT NULL COMMENT \'Nome do usuário\', `data_cadastro` datetime(6) NOT NULL COMMENT \'Data de cadastro do usuário\' DEFAULT CURRENT_TIMESTAMP(6), `data_desativado` datetime(6) NULL COMMENT \'Coluna usada para o Soft Delete, caso tenha um valor, o usuário foi inativado nessa data\', `crfa` varchar(8) NOT NULL COMMENT \'crfa\', `tempo_experiencia` enum (\'Menos de 1 ano\', \'De 1 a 3 anos\', \'De 3 a 5 anos\', \'Mais de 5 anos\') NOT NULL COMMENT \'Json do tempo de experiência\', UNIQUE INDEX `IDX_b9d94faecf55e50dd0b4006756` (`login`), PRIMARY KEY (`id_usuario`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `email_fonoaudiologo` ADD CONSTRAINT `FK_3f8d8d5fcbecf57d288c0cf4629` FOREIGN KEY (`fk_fonoaudiologo`) REFERENCES `fonoaudiologo`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `tel_fonoaudiologo` ADD CONSTRAINT `FK_9a92c59cf9421ca118a21415b74` FOREIGN KEY (`fk_fonoaudiologo`) REFERENCES `fonoaudiologo`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `tel_fonoaudiologo` DROP FOREIGN KEY `FK_9a92c59cf9421ca118a21415b74`');
        await queryRunner.query('ALTER TABLE `email_fonoaudiologo` DROP FOREIGN KEY `FK_3f8d8d5fcbecf57d288c0cf4629`');
        await queryRunner.query('DROP INDEX `IDX_b9d94faecf55e50dd0b4006756` ON `fonoaudiologo`');
        await queryRunner.query('DROP TABLE `fonoaudiologo`');
        await queryRunner.query('DROP TABLE `tel_fonoaudiologo`');
        await queryRunner.query('DROP INDEX `IDX_a9b0ce7b63e546a1f8b2f7196b` ON `email_fonoaudiologo`');
        await queryRunner.query('DROP TABLE `email_fonoaudiologo`');
    }

}
