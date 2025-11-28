import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Therapist } from '../therapist/Therapist';
import { Triage } from '../triage/Triage';

@Entity('orientacao')
export class Orientation extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id_orientation' })
    id: number;

    @Column({ comment: 'Descreve a orientação', length: 255, name: 'descricao',
        type: 'varchar',
    })
    description: string;

    @Column({ comment: 'Data de desativação do equipamento', default: null,
        name: 'data_desativacao',
        nullable: true,
        type: 'date'
    })
    dateOfDeactivation: Date;

    @JoinColumn({ name: 'fk_fonoaudiologo' })
    @ManyToOne(() => Therapist, { nullable: true })
    therapist: Therapist;

    @OneToMany(() => Triage, (triage) => triage.therapist)
    triages: Triage;
}
