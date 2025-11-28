import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatingStates1960609051470 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT into estado (codigo_ibge,nome,uf)
            VALUES (12, 'Acre', 'AC'),
                   (27, 'Alagoas', 'AL'),
                   (16, 'Amapá', 'AP'),
                   (13, 'Amazonas', 'AM'),
                   (29, 'Bahia', 'BA'),
                   (23, 'Ceará', 'CE'),
                   (53, 'Distrito Federal', 'DF'),
                   (32, 'Espírito Santo', 'ES'),
                   (52, 'Goiás', 'GO'),
                   (21, 'Maranhão', 'MA'),
                   (51, 'Mato Grosso', 'MT'),
                   (50, 'Mato Grosso do Sul', 'MS'),
                   (31, 'Minas Gerais', 'MG'),
                   (15, 'Pará', 'PA'),
                   (25, 'Paraíba', 'PB'),
                   (41, 'Paraná', 'PR'),
                   (26, 'Pernambuco', 'PE'),
                   (22, 'Piauí', 'PI'),
                   (33, 'Rio de Janeiro', 'RJ'),
                   (24, 'Rio Grande do Norte', 'RN'),
                   (43, 'Rio Grande do Sul', 'RS'),
                   (11, 'Rondônia', 'RO'),
                   (14, 'Roraima', 'RR'),
                   (42, 'Santa Catarina', 'SC'),
                   (35, 'São Paulo', 'SP'),
                   (28, 'Sergipe', 'SE'),
                   (17, 'Tocantins', 'TO');
        `);

        await queryRunner.query(`
            UPDATE estado e
            SET e.secretaria_nome = 'Secretaria de Estado da Saúde de Santa Catarina',
                e.secretaria_emails = 'ouvidoria@saude.sc.gov.br,apoiogabs@saude.sc.gov.br'
            WHERE e.uf = 'SC'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable('estado');
    }

}
