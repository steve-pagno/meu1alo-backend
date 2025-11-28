import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneratingStateDefaultUser1960612028888 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO usuario_secretaria (login, password, nome_usuario, fk_secretaria_estado) VALUES 
                ('secretaria.ac', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado do Acre', (SELECT id_estado FROM estado WHERE uf = 'AC')),
                ('secretaria.al', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Alagoas', (SELECT id_estado FROM estado WHERE uf = 'AL')),
                ('secretaria.ap', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado do Amapá', (SELECT id_estado FROM estado WHERE uf = 'AP')),
                ('secretaria.am', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Amazonas', (SELECT id_estado FROM estado WHERE uf = 'AM')),
                ('secretaria.ba', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Bahia', (SELECT id_estado FROM estado WHERE uf = 'BA')),
                ('secretaria.ce', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado do Ceará', (SELECT id_estado FROM estado WHERE uf = 'CE')),
                ('secretaria.df', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Distrito Federal', (SELECT id_estado FROM estado WHERE uf = 'DF')),
                ('secretaria.es', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Espírito Santo', (SELECT id_estado FROM estado WHERE uf = 'ES')),
                ('secretaria.go', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Goiás', (SELECT id_estado FROM estado WHERE uf = 'GO')),
                ('secretaria.ma', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Maranhão', (SELECT id_estado FROM estado WHERE uf = 'MA')),
                ('secretaria.mt', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Mato Grosso', (SELECT id_estado FROM estado WHERE uf = 'MT')),
                ('secretaria.ms', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Mato Grosso do Sul', (SELECT id_estado FROM estado WHERE uf = 'MS')),
                ('secretaria.mg', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Minas Gerais', (SELECT id_estado FROM estado WHERE uf = 'MG')),
                ('secretaria.pa', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado do Pará', (SELECT id_estado FROM estado WHERE uf = 'PA')),
                ('secretaria.pb', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Paraíba', (SELECT id_estado FROM estado WHERE uf = 'PB')),
                ('secretaria.pr', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Paraná', (SELECT id_estado FROM estado WHERE uf = 'PR')),
                ('secretaria.pe', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Pernambuco', (SELECT id_estado FROM estado WHERE uf = 'PE')),
                ('secretaria.pi', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado do Piauí', (SELECT id_estado FROM estado WHERE uf = 'PI')),
                ('secretaria.rj', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Rio de Janeiro', (SELECT id_estado FROM estado WHERE uf = 'RJ')),
                ('secretaria.rn', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Rio Grande do Norte', (SELECT id_estado FROM estado WHERE uf = 'RN')),
                ('secretaria.rs', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Rio Grande do Sul', (SELECT id_estado FROM estado WHERE uf = 'RS')),
                ('secretaria.ro', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Rondônia', (SELECT id_estado FROM estado WHERE uf = 'RO')),
                ('secretaria.rr', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Roraima', (SELECT id_estado FROM estado WHERE uf = 'RR')),
                ('secretaria.sc', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Santa Catarina', (SELECT id_estado FROM estado WHERE uf = 'SC')),
                ('secretaria.sp', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de São Paulo', (SELECT id_estado FROM estado WHERE uf = 'SP')),
                ('secretaria.se', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Sergipe', (SELECT id_estado FROM estado WHERE uf = 'SE')),
                ('secretaria.to', '3962ad87272fa6e199e73fdd1a71da878e22d04500dd3c8d3fce2221f8f047b8', 'Secretaria do Estado de Tocantins', (SELECT id_estado FROM estado WHERE uf = 'TO'));
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable('usuario_secretaria');
    }

}
