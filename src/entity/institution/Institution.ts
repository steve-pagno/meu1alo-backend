import { ValidateNested } from 'class-validator';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { InstitutionType } from '../../controllers/institution/InstitutionTypes';
import { AddressComponent as Address } from '../decorators/components/Address';
import { Therapist } from '../therapist/Therapist';
import { Triage } from '../triage/Triage';
import { InstitutionUser as User } from './InstitutionUser';

@Entity('instituicao')
export class Institution extends BaseEntity {

    @PrimaryGeneratedColumn({
        comment: 'Chave primária da instituição',
        name: 'id_instituicao',
    })
    id: number;

    @Column({
        comment: 'Nome instituição', length: 255, name: 'nome_instituicao',
        nullable: false, type: 'varchar'
    })
    institutionName: string;

    @Column({
        comment: 'CNES', length: 11, name: 'cnes',
        nullable: false, type: 'varchar'
    })
    cnes: string;

    @Column({
        comment: 'CNPJ', length: 14, name: 'cnpj',
        nullable: true, type: 'varchar'
    })
    cnpj: string;

    @Column({
        comment: 'Tipo de Instituição', enum: InstitutionType, name: 'tipo_instituicao', nullable: false,
        type: 'enum', update: false
    })
    institutionType: InstitutionType;

    @ValidateNested()
    @Column(() => Address, { prefix: false })
    address: Address;

    // Relacionamentos

    @OneToMany(() => User, (user) => user.institution)
    users: User[];

    @ManyToMany(() => Therapist, (therapist) => therapist.institutions)
    therapists: Therapist[];

    @OneToMany(() => Triage, (triage) => triage.therapist)
    triages: Triage;

}
