import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqueConstraintFromBirthMother1760000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the non-unique index first so MySQL foreign key remains satisfied
        await queryRunner.query('CREATE INDEX `IDX_bebe_fk_mae_bio_non_unique` ON `bebe` (`fk_mae_bio`)');

        // Drop the unique indexes
        await queryRunner.query('DROP INDEX `REL_05c2dbd5574e98c267b3b80645` ON `bebe`');
        await queryRunner.query('ALTER TABLE `bebe` DROP INDEX `IDX_05c2dbd5574e98c267b3b80645`');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Re-create the unique indexes
        await queryRunner.query('ALTER TABLE `bebe` ADD UNIQUE INDEX `IDX_05c2dbd5574e98c267b3b80645` (`fk_mae_bio`)');
        await queryRunner.query('CREATE UNIQUE INDEX `REL_05c2dbd5574e98c267b3b80645` ON `bebe` (`fk_mae_bio`)');

        // Drop the non-unique index
        await queryRunner.query('DROP INDEX `IDX_bebe_fk_mae_bio_non_unique` ON `bebe`');
    }
}
