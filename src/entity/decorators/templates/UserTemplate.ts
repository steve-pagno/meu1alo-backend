import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn
} from 'typeorm';

/**
 * Entidade abstrata representando um usuário.
 *
 * Esta entidade não representa uma tabela no banco, mas serve de
 * template para várias tabelas.
 */
export abstract class UserTemplate extends BaseEntity {

    @PrimaryGeneratedColumn({ comment: 'Chave primária de um usuário. é única apenas dentro de uma tabela.',
        name: 'id_usuario',
    })
    id: number;

    @Column({
        comment: 'Login do usuário, definido pelo user, exceto pais que é gerado pelo sistema', length: 255, name: 'login', nullable: false, type: 'varchar', unique: true,
        update: false
    })
    login: string;

    @Column({
        comment: 'password do usuário', length: 255, name: 'password',
        nullable: false, type: 'varchar'
    })
    password: string;

    @Column ({
        comment: 'Força a mudança de senha no próximo login', default: false, name:'resetar_senha',
        type: 'boolean'
    })
    forcePasswordReset: boolean;

    @Column({
        comment: 'Nome do usuário', length: 255, name: 'nome_usuario',
        nullable: false, type: 'varchar'
    })
    name: string;

    // Controle

    @CreateDateColumn({ comment: 'Data de cadastro do usuário', name: 'data_cadastro',
        type: 'datetime',
    })
    registrationDate: Date;

    @DeleteDateColumn({ comment: 'Coluna usada para o Soft Delete, caso tenha um valor, o usuário foi inativado nessa data', name: 'data_desativado', nullable: true,
        type: 'datetime',
    })
    disableDate: Date;
}
