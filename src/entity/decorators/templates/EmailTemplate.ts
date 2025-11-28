import { IsEmail } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entidade abstrata representando um e-mail.
 *
 * Esta entidade não representa uma tabela no banco, mas serve de
 * template para várias tabelas.
 */
export abstract class EmailTemplate extends BaseEntity {

    @PrimaryGeneratedColumn({ comment: 'Chave primaria de um email',
        name: 'id_email',
    })
    id: number;

    @IsEmail()
    @Column({ comment: 'Endereço de email para contato', length: 255, name: 'email', type: 'varchar' })
    email: string;

    @Column({ comment: 'Marca o email principal da conta', default: false, name: 'is_principal',
        type: 'boolean',
    })
    isMainEmail: boolean;

    @CreateDateColumn({ comment: 'Data de cadastro do email', name: 'data_cadastro',
        type: 'datetime',
    })
    registrationDate: Date;

    @DeleteDateColumn({ comment: 'Coluna usada para o Soft Delete, caso tenha um valor, o email foi inativado nessa data', name: 'data_desativado', nullable: true,
        type: 'datetime',
    })
    disableDate: Date;

}
