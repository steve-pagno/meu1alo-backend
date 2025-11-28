import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Therapist } from '../therapist/Therapist';
import { Triage } from '../triage/Triage';

@Entity('conduta')
export class Conduct extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id_conduct' })
    id: number;

    @Column({ comment: 'Descrição da conduta', name: 'descricao_resultado',
        type: 'text',
    })
    resultDescription: string;

    @Column({ comment: 'Descrição do acompanhamento', name: 'descricao_acompanhamento',
        type: 'text',
    })
    accompanyDescription: string;

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

    @Column({
        comment: 'Se o a conduta está relacionada com o irda', name: 'irda',
        nullable: false, type: 'tinyint'
    })
    irda: boolean;

    @Column({
        comment: 'Se é relacionado ao teste, reteste e teste e reteste', name: 'tipo_teste',
        nullable: false, type: 'int'
    })
    testType: number;

    @JoinColumn({ name: 'fk_fonoaudiologo' })
    @ManyToOne(() => Therapist, { nullable: true })
    therapist: Therapist;

    @OneToMany(() => Triage, (triage) => triage.therapist)
    triages: Triage;
}
