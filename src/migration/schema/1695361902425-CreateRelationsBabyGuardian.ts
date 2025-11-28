import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelationsBabyGuardian1695361902425 implements MigrationInterface {
    name = 'CreateRelationsBabyGuardian1695361902425';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `bebe_responsavel` (`fk_bebe` int NOT NULL, `fk_responsavel` int NOT NULL, INDEX `IDX_7a4e62e4f8e13c282c3e2c9c37` (`fk_bebe`), INDEX `IDX_9e1792f437507f6e3e44a2c142` (`fk_responsavel`), PRIMARY KEY (`fk_bebe`, `fk_responsavel`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `bebe` ADD `fk_mae_bio` int NOT NULL COMMENT \'Chave primária de um usuário. é única apenas dentro de uma tabela.\'');
        await queryRunner.query('ALTER TABLE `bebe` ADD UNIQUE INDEX `IDX_05c2dbd5574e98c267b3b80645` (`fk_mae_bio`)');
        await queryRunner.query('CREATE UNIQUE INDEX `REL_05c2dbd5574e98c267b3b80645` ON `bebe` (`fk_mae_bio`)');
        await queryRunner.query('ALTER TABLE `bebe` ADD CONSTRAINT `FK_05c2dbd5574e98c267b3b80645c` FOREIGN KEY (`fk_mae_bio`) REFERENCES `responsavel`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `bebe_responsavel` ADD CONSTRAINT `FK_7a4e62e4f8e13c282c3e2c9c37c` FOREIGN KEY (`fk_bebe`) REFERENCES `bebe`(`id_bebe`) ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE `bebe_responsavel` ADD CONSTRAINT `FK_9e1792f437507f6e3e44a2c1428` FOREIGN KEY (`fk_responsavel`) REFERENCES `responsavel`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `bebe_responsavel` DROP FOREIGN KEY `FK_9e1792f437507f6e3e44a2c1428`');
        await queryRunner.query('ALTER TABLE `bebe_responsavel` DROP FOREIGN KEY `FK_7a4e62e4f8e13c282c3e2c9c37c`');
        await queryRunner.query('ALTER TABLE `bebe` DROP FOREIGN KEY `FK_05c2dbd5574e98c267b3b80645c`');
        await queryRunner.query('DROP INDEX `REL_05c2dbd5574e98c267b3b80645` ON `bebe`');
        await queryRunner.query('ALTER TABLE `bebe` DROP INDEX `IDX_05c2dbd5574e98c267b3b80645`');
        await queryRunner.query('ALTER TABLE `bebe` DROP COLUMN `fk_mae_bio`');
        await queryRunner.query('DROP INDEX `IDX_9e1792f437507f6e3e44a2c142` ON `bebe_responsavel`');
        await queryRunner.query('DROP INDEX `IDX_7a4e62e4f8e13c282c3e2c9c37` ON `bebe_responsavel`');
        await queryRunner.query('DROP TABLE `bebe_responsavel`');
    }

}
