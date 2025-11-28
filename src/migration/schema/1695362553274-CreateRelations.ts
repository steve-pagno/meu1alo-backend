import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelations1695362553274 implements MigrationInterface {
    name = 'CreateRelations1695362553274';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX `IDX_05c2dbd5574e98c267b3b80645` ON `bebe`');
        await queryRunner.query('CREATE TABLE `fonoaudiologo_instituicao` (`fk_fonoaudiologo` int NOT NULL, `fk_instituicao` int NOT NULL, INDEX `IDX_7077e424ccbe231dc2e49024f0` (`fk_fonoaudiologo`), INDEX `IDX_f01631078e213c0238f9aeb506` (`fk_instituicao`), PRIMARY KEY (`fk_fonoaudiologo`, `fk_instituicao`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `triagem_indicador` (`fk_triagem` int NOT NULL, `fk_indicador` int NOT NULL, INDEX `IDX_9b471bdd3f4f16998d9428ba2d` (`fk_triagem`), INDEX `IDX_bc5f3d5aed29cfda61c0658add` (`fk_indicador`), PRIMARY KEY (`fk_triagem`, `fk_indicador`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `responsavel` ADD `fk_municipio` int NOT NULL');
        await queryRunner.query('ALTER TABLE `responsavel` ADD `rua` varchar(255) NOT NULL COMMENT \'Rua em que se encontra esse endereço\'');
        await queryRunner.query('ALTER TABLE `responsavel` ADD `numero` int NOT NULL COMMENT \'Numero do estabelecimento\'');
        await queryRunner.query('ALTER TABLE `responsavel` ADD `complemento` varchar(255) NULL COMMENT \'Complemento para o endereço\'');
        await queryRunner.query('ALTER TABLE `responsavel` ADD `CEP` varchar(8) NOT NULL COMMENT \'CEP do endereço\'');
        await queryRunner.query('ALTER TABLE `instituicao` ADD `fk_municipio` int NOT NULL');
        await queryRunner.query('ALTER TABLE `instituicao` ADD `rua` varchar(255) NOT NULL COMMENT \'Rua em que se encontra esse endereço\'');
        await queryRunner.query('ALTER TABLE `instituicao` ADD `numero` int NOT NULL COMMENT \'Numero do estabelecimento\'');
        await queryRunner.query('ALTER TABLE `instituicao` ADD `complemento` varchar(255) NULL COMMENT \'Complemento para o endereço\'');
        await queryRunner.query('ALTER TABLE `instituicao` ADD `CEP` varchar(8) NOT NULL COMMENT \'CEP do endereço\'');
        await queryRunner.query('ALTER TABLE `orientacao` ADD `fk_fonoaudiologo` int NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\'');
        await queryRunner.query('ALTER TABLE `conduta` ADD `fk_fonoaudiologo` int NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\'');
        await queryRunner.query('ALTER TABLE `indicador_risco` ADD `fk_fonoaudiologo` int NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\'');
        await queryRunner.query('ALTER TABLE `triagem` ADD `fk_fonoaudiologo` int NOT NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\'');
        await queryRunner.query('ALTER TABLE `triagem` ADD `fk_equipamento` int NOT NULL');
        await queryRunner.query('ALTER TABLE `triagem` ADD `fk_conduta` int NOT NULL');
        await queryRunner.query('ALTER TABLE `triagem` ADD `fk_orientacao` int NOT NULL');
        await queryRunner.query('ALTER TABLE `triagem` ADD `fk_instituicao` int NOT NULL COMMENT \'Chave primária da instituição\'');
        await queryRunner.query('ALTER TABLE `triagem` ADD `fk_bebe` int NOT NULL COMMENT \'Chave primária do bebê\'');
        await queryRunner.query('ALTER TABLE `servico_referencia` ADD `fk_municipio` int NOT NULL');
        await queryRunner.query('ALTER TABLE `servico_referencia` ADD `rua` varchar(255) NOT NULL COMMENT \'Rua em que se encontra esse endereço\'');
        await queryRunner.query('ALTER TABLE `servico_referencia` ADD `numero` int NOT NULL COMMENT \'Numero do estabelecimento\'');
        await queryRunner.query('ALTER TABLE `servico_referencia` ADD `complemento` varchar(255) NULL COMMENT \'Complemento para o endereço\'');
        await queryRunner.query('ALTER TABLE `servico_referencia` ADD `CEP` varchar(8) NOT NULL COMMENT \'CEP do endereço\'');
        await queryRunner.query('ALTER TABLE `responsavel` ADD CONSTRAINT `FK_f4bc3143258b4fb476c8d29dc77` FOREIGN KEY (`fk_municipio`) REFERENCES `municipio`(`id_municipio`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `instituicao` ADD CONSTRAINT `FK_39217a93fde8a514cdc2509fdb2` FOREIGN KEY (`fk_municipio`) REFERENCES `municipio`(`id_municipio`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `orientacao` ADD CONSTRAINT `FK_8d0f05c8c0ea0e9cef23ada2cd3` FOREIGN KEY (`fk_fonoaudiologo`) REFERENCES `fonoaudiologo`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `conduta` ADD CONSTRAINT `FK_5f0de69a3f05aed9e0203c549c5` FOREIGN KEY (`fk_fonoaudiologo`) REFERENCES `fonoaudiologo`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `indicador_risco` ADD CONSTRAINT `FK_dd07799f3cdc394083869611341` FOREIGN KEY (`fk_fonoaudiologo`) REFERENCES `fonoaudiologo`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `triagem` ADD CONSTRAINT `FK_5c82fcdf13c5758d13a4710e085` FOREIGN KEY (`fk_fonoaudiologo`) REFERENCES `fonoaudiologo`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `triagem` ADD CONSTRAINT `FK_6e671d521bd1d767eb6bfb6fe3c` FOREIGN KEY (`fk_equipamento`) REFERENCES `equipamento`(`id_equipamento`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `triagem` ADD CONSTRAINT `FK_b9dba7271675fc4aee8748aed75` FOREIGN KEY (`fk_conduta`) REFERENCES `conduta`(`id_conduct`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `triagem` ADD CONSTRAINT `FK_0e6810f8006ae3ff60b25dee3e4` FOREIGN KEY (`fk_orientacao`) REFERENCES `orientacao`(`id_orientation`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `triagem` ADD CONSTRAINT `FK_6e363287e8877a28ad23e9bf4f7` FOREIGN KEY (`fk_instituicao`) REFERENCES `instituicao`(`id_instituicao`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `triagem` ADD CONSTRAINT `FK_5066ab389b8edd8bc4776e227af` FOREIGN KEY (`fk_bebe`) REFERENCES `bebe`(`id_bebe`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `servico_referencia` ADD CONSTRAINT `FK_b64e7693a00951e8c517cc7fcf8` FOREIGN KEY (`fk_municipio`) REFERENCES `municipio`(`id_municipio`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `fonoaudiologo_instituicao` ADD CONSTRAINT `FK_7077e424ccbe231dc2e49024f00` FOREIGN KEY (`fk_fonoaudiologo`) REFERENCES `fonoaudiologo`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE `fonoaudiologo_instituicao` ADD CONSTRAINT `FK_f01631078e213c0238f9aeb506a` FOREIGN KEY (`fk_instituicao`) REFERENCES `instituicao`(`id_instituicao`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `triagem_indicador` ADD CONSTRAINT `FK_9b471bdd3f4f16998d9428ba2df` FOREIGN KEY (`fk_triagem`) REFERENCES `triagem`(`id_triagem`) ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE `triagem_indicador` ADD CONSTRAINT `FK_bc5f3d5aed29cfda61c0658addc` FOREIGN KEY (`fk_indicador`) REFERENCES `indicador_risco`(`id_indicador_risco`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `triagem_indicador` DROP FOREIGN KEY `FK_bc5f3d5aed29cfda61c0658addc`');
        await queryRunner.query('ALTER TABLE `triagem_indicador` DROP FOREIGN KEY `FK_9b471bdd3f4f16998d9428ba2df`');
        await queryRunner.query('ALTER TABLE `fonoaudiologo_instituicao` DROP FOREIGN KEY `FK_f01631078e213c0238f9aeb506a`');
        await queryRunner.query('ALTER TABLE `fonoaudiologo_instituicao` DROP FOREIGN KEY `FK_7077e424ccbe231dc2e49024f00`');
        await queryRunner.query('ALTER TABLE `servico_referencia` DROP FOREIGN KEY `FK_b64e7693a00951e8c517cc7fcf8`');
        await queryRunner.query('ALTER TABLE `triagem` DROP FOREIGN KEY `FK_5066ab389b8edd8bc4776e227af`');
        await queryRunner.query('ALTER TABLE `triagem` DROP FOREIGN KEY `FK_6e363287e8877a28ad23e9bf4f7`');
        await queryRunner.query('ALTER TABLE `triagem` DROP FOREIGN KEY `FK_0e6810f8006ae3ff60b25dee3e4`');
        await queryRunner.query('ALTER TABLE `triagem` DROP FOREIGN KEY `FK_b9dba7271675fc4aee8748aed75`');
        await queryRunner.query('ALTER TABLE `triagem` DROP FOREIGN KEY `FK_6e671d521bd1d767eb6bfb6fe3c`');
        await queryRunner.query('ALTER TABLE `triagem` DROP FOREIGN KEY `FK_5c82fcdf13c5758d13a4710e085`');
        await queryRunner.query('ALTER TABLE `indicador_risco` DROP FOREIGN KEY `FK_dd07799f3cdc394083869611341`');
        await queryRunner.query('ALTER TABLE `conduta` DROP FOREIGN KEY `FK_5f0de69a3f05aed9e0203c549c5`');
        await queryRunner.query('ALTER TABLE `orientacao` DROP FOREIGN KEY `FK_8d0f05c8c0ea0e9cef23ada2cd3`');
        await queryRunner.query('ALTER TABLE `instituicao` DROP FOREIGN KEY `FK_39217a93fde8a514cdc2509fdb2`');
        await queryRunner.query('ALTER TABLE `responsavel` DROP FOREIGN KEY `FK_f4bc3143258b4fb476c8d29dc77`');
        await queryRunner.query('ALTER TABLE `servico_referencia` DROP COLUMN `CEP`');
        await queryRunner.query('ALTER TABLE `servico_referencia` DROP COLUMN `complemento`');
        await queryRunner.query('ALTER TABLE `servico_referencia` DROP COLUMN `numero`');
        await queryRunner.query('ALTER TABLE `servico_referencia` DROP COLUMN `rua`');
        await queryRunner.query('ALTER TABLE `servico_referencia` DROP COLUMN `fk_municipio`');
        await queryRunner.query('ALTER TABLE `triagem` DROP COLUMN `fk_bebe`');
        await queryRunner.query('ALTER TABLE `triagem` DROP COLUMN `fk_instituicao`');
        await queryRunner.query('ALTER TABLE `triagem` DROP COLUMN `fk_orientacao`');
        await queryRunner.query('ALTER TABLE `triagem` DROP COLUMN `fk_conduta`');
        await queryRunner.query('ALTER TABLE `triagem` DROP COLUMN `fk_equipamento`');
        await queryRunner.query('ALTER TABLE `triagem` DROP COLUMN `fk_fonoaudiologo`');
        await queryRunner.query('ALTER TABLE `indicador_risco` DROP COLUMN `fk_fonoaudiologo`');
        await queryRunner.query('ALTER TABLE `conduta` DROP COLUMN `fk_fonoaudiologo`');
        await queryRunner.query('ALTER TABLE `orientacao` DROP COLUMN `fk_fonoaudiologo`');
        await queryRunner.query('ALTER TABLE `instituicao` DROP COLUMN `CEP`');
        await queryRunner.query('ALTER TABLE `instituicao` DROP COLUMN `complemento`');
        await queryRunner.query('ALTER TABLE `instituicao` DROP COLUMN `numero`');
        await queryRunner.query('ALTER TABLE `instituicao` DROP COLUMN `rua`');
        await queryRunner.query('ALTER TABLE `instituicao` DROP COLUMN `fk_municipio`');
        await queryRunner.query('ALTER TABLE `responsavel` DROP COLUMN `CEP`');
        await queryRunner.query('ALTER TABLE `responsavel` DROP COLUMN `complemento`');
        await queryRunner.query('ALTER TABLE `responsavel` DROP COLUMN `numero`');
        await queryRunner.query('ALTER TABLE `responsavel` DROP COLUMN `rua`');
        await queryRunner.query('ALTER TABLE `responsavel` DROP COLUMN `fk_municipio`');
        await queryRunner.query('DROP INDEX `IDX_bc5f3d5aed29cfda61c0658add` ON `triagem_indicador`');
        await queryRunner.query('DROP INDEX `IDX_9b471bdd3f4f16998d9428ba2d` ON `triagem_indicador`');
        await queryRunner.query('DROP TABLE `triagem_indicador`');
        await queryRunner.query('DROP INDEX `IDX_f01631078e213c0238f9aeb506` ON `fonoaudiologo_instituicao`');
        await queryRunner.query('DROP INDEX `IDX_7077e424ccbe231dc2e49024f0` ON `fonoaudiologo_instituicao`');
        await queryRunner.query('DROP TABLE `fonoaudiologo_instituicao`');
        await queryRunner.query('CREATE UNIQUE INDEX `IDX_05c2dbd5574e98c267b3b80645` ON `bebe` (`fk_mae_bio`)');
    }

}
