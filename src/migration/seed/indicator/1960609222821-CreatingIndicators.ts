import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatingIndicators1960609222821 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO indicador_risco (nome) VALUES
                 ('Suspeita familiar de perda auditiva, alteração de fala ou linguagem e atraso ou regressão do desenvolvimento'),
                 ('Antecedente familiar de PA permanente, incluindo casos de consanguinidade'),
                 ('Ventilação extracorpórea (ECMO)'),
                 ('Ventilação assistida'),
                 ('Drogas ototóxicas por mais de cinco dias'),
                 ('Aminoglicosídeos'),
                 ('Diuréticos de alça'),
                 ('Hiperbilirrubinemia'),
                 ('Anóxia perinatal grave'),
                 ('Asfixia'),
                 ('Encefalopatia hipóxico-isquêmica'),
                 ('Apgar Neonatal de 0 a 4 no primeiro minuto, ou 0 a 6 no quinto minuto'),
                 ('Peso ao nascer inferior a 1.500 gramas'),
                 ('Toxoplasmose'),
                 ('Rubéola'),
                 ('Citomegalovírus'),
                 ('Herpes'),
                 ('Sífilis'),
                 ('HIV'),
                 ('Zika vírus'),
                 ('COVID'),
                 ('Microcefalia congênita'),
                 ('Hidrocefalia congênita ou adquirida'),
                 ('Anormalidades do osso temporal'),
                 ('Síndromes genéticas que cursam com deficiência auditiva'),
                 ('Distúrbios neurodegenerativos'),
                 ('Citomegalovírus'),
                 ('Sarampo'),
                 ('Varicela'),
                 ('Meningite'),
                 ('Traumatismo craniano'),
                 ('Quimioterapia'),
                 ('Encefalites bacterianas ou virais');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable('indicador_risco');
    }

}
