import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Baby } from '../baby/Baby';
import { Conduct } from '../conduct/Conduct';
import { Equipment } from '../equipment/Equipment';
import { Indicator } from '../indicator/Indicator';
import { Institution } from '../institution/Institution';
import { Orientation } from '../orientation/Orientation';
import { Therapist } from '../therapist/Therapist';

export type TriageString = 'EOET' | 'EOEP' | 'PEATEA' | 'EOET_PEATEA';
export enum TriageType {
    EOET = 'EOE transitente',
    EOEP = 'EOE produto de distorção',
    PEATEA = 'PEATE automático',
    EOET_PEATEA = 'EOE transitente + PEATE automático',
}

@Entity('triagem')
export class Triage extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id_triagem' })
    id: number;

    @Column({
        comment: 'Se a orelha esquerda passou no teste', name: 'orelha_esquerda',
        nullable: false, type: 'tinyint'
    })
    leftEar: boolean;

    @Column({
        comment: 'Se a orelha direita passou no teste', name: 'orelha_direita',
        nullable: false, type: 'tinyint'
    })
    rightEar: boolean;

    @Column({ comment: 'Data em que foi feito a avaliação)', name: 'data_avaliacao', type: 'datetime',
        update: false,
    })
    evaluationDate: Date;

    @Column({ comment: 'Tipo de triagem', enum: TriageType, name: 'tipo_triagem', type: 'enum',
        update: false,
    })
    type: TriageType;

    @Column({ comment: 'Qualquer tipo de observação sobre a triagem', name: 'observacao',
        type: 'text',
    })
    observation: string;

    // Relacionamentos

    @JoinColumn({ name: 'fk_fonoaudiologo' })
    @ManyToOne(() => Therapist, { nullable: false })
    therapist: Therapist;

    @JoinColumn({ name: 'fk_equipamento' })
    @ManyToOne(() => Equipment, { nullable: false })
    equipment: Equipment;

    @JoinColumn({ name: 'fk_conduta' })
    @ManyToOne(() => Conduct, { nullable: false })
    conduct: Conduct;

    @JoinColumn({ name: 'fk_orientacao' })
    @ManyToOne(() => Orientation, { nullable: false })
    orientation: Orientation;

    @JoinColumn({ name: 'fk_instituicao' })
    @ManyToOne(() => Institution, { nullable: false })
    institution: Institution;

    @JoinColumn({ name: 'fk_bebe' })
    @ManyToOne(() => Baby, { nullable: false })
    baby: Baby;

    @JoinTable({ inverseJoinColumn: { name: 'fk_indicador' },
        joinColumn: { name: 'fk_triagem' }, name: 'triagem_indicador',
    })
    @ManyToMany(() => Indicator, (indicator) => indicator.triages)
    indicators: Indicator[];
}
