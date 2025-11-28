import { Length } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entidade abstrata representando um telefone.
 *
 * Esta entidade não representa uma tabela no banco, mas serve de
 * template para várias tabelas.
 */
export class PhoneTemplate extends BaseEntity {

    @PrimaryGeneratedColumn({ comment: 'Chave primaria de um telefone',
        name: 'id_tel',
    })
    id: number;

    @Column({ comment: 'Número do telefone, DDD + número', length: 15, name: 'numero',
        type: 'varchar',
    })
    @Length(14, 15)
    phoneNumber: string;

    @Column({ comment: 'Nome do contato do número telefonico', length: 45, name: 'nome_contato', nullable: true,
        type: 'varchar',
    })
    contactName: string;

    @Column({ comment: 'Diz se o número tem uma conta no whatsapp', default: false, name: 'is_whatsapp',
        type: 'boolean',
    })
    isWhatsapp: boolean;

    @Column({ comment: 'Marca o telefone principal da conta', default: false, name: 'is_principal',
        type: 'boolean',
    })
    isMainPhone: boolean;

    @CreateDateColumn({ comment: 'Data de cadastro do telefone', name: 'data_cadastro',
        type: 'datetime',
    })
    registrationDate: Date;

    @DeleteDateColumn({ comment: 'Coluna usada para o Soft Delete, caso tenha um valor, o telefone foi inativado nessa data', name: 'data_desativado', nullable: true,
        type: 'datetime',
    })
    disableDate: Date;

}
