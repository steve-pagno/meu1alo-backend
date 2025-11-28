import { ValidateNested } from 'class-validator';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AddressComponent as Address } from '../decorators/components/Address';
import { ReferralServiceEmail as Email } from './ReferralServiceEmail';
import { ReferralServicePhone as Phone } from './ReferralServicePhone';

export type ReferralServiceTypeString = 'SUS' | 'PRIVATE' | 'MIXED';
export enum ReferralServiceType {
    SUS = 'Serviço do Sistema Único de Saúde(SUS)',
    PRIVATE = 'Serviço Privado',
    MIXED = 'Serviço Misto',
}

/**
 * Serviço de referência para o qual o bebê é encaminhado
 * de acordo com o parecer de um fonoaudiólogo.
 */
@Entity('servico_referencia')
export class ReferralService extends BaseEntity {

    @PrimaryGeneratedColumn({
        comment: 'Chave primária do servico de referencia',
        name: 'id_servico',
    })
    id: number;

    @Column({
        comment: 'Nome do Serviço', length: 255, name: 'nome_servico',
        type: 'varchar',
    })
    name: string;

    @Column({ comment: 'CNPJ do servico de referencia', length: 14, name: 'cnpj', nullable: true,
        type: 'varchar',
    })
    cnpj: string;

    @Column({ length: 11, name: 'cnes', nullable: true, type: 'varchar' })
    cnes: string;

    @Column({ comment: 'Tipo de Serviço', enum: ReferralServiceType, name: 'tipo_servico', type: 'enum',
        update: false,
    })
    typeService: ReferralServiceType;

    @ValidateNested()
    @Column(() => Address, { prefix: false })
    address: Address;

    // Controle

    @CreateDateColumn({ comment: 'Data de cadastro do serviço de referencia', name: 'data_cadastro',
        type: 'datetime',
    })
    registrationDate: Date;

    @DeleteDateColumn({ comment: 'Coluna usada para o Soft Delete, caso tenha um valor, o serviço de referencia foi inativado nessa data', name: 'data_desativado', nullable: true,
        type: 'datetime',
    })
    disableDate: Date;

    // Relacionamentos

    @OneToMany(() => Email, (email) => email.service, {
        cascade: ['soft-remove', 'recover', 'remove'],
    })
    emails: Email[];

    @OneToMany(() => Phone, (phone) => phone.service, {
        cascade: ['soft-remove', 'recover', 'remove'],
    })
    phones: Phone[];
}
