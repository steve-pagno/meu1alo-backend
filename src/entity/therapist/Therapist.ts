import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { TherapistXP } from '../../controllers/therapist/TherapistTypes';
import { UserTemplate as User } from '../decorators/templates/UserTemplate';
import { Institution } from '../institution/Institution';
import { Orientation } from '../orientation/Orientation';
import { Triage } from '../triage/Triage';
import { TherapistEmail as Email } from './TherapistEmail';
import { TherapistPhone as Phone } from './TherapistPhone';

/**
 * O profissional de fonoaudiologia que ira atender o bebe
 */
@Entity('fonoaudiologo')
export class Therapist extends User {
    @Column({
        comment: 'crfa', length: 8, name: 'crfa',
        nullable: false, type: 'varchar'
    })
    crfa: string;

    @Column({ comment: 'Json do tempo de experiência', enum: TherapistXP, name: 'tempo_experiencia', type: 'enum',
        update: false,
    })
    xp: TherapistXP;

    // Relacionamentos

    @OneToMany(() => Email, (email) => email.therapist, {
        cascade: ['soft-remove', 'recover', 'remove'],
    })
    emails: Email[];

    @OneToMany(() => Phone, (phone) => phone.therapist, {
        cascade: ['soft-remove', 'recover', 'remove'],
    })
    phones: Phone[];

    @JoinTable ({ inverseJoinColumn: { name: 'fk_instituicao' },
        joinColumn: { name: 'fk_fonoaudiologo' }, name: 'fonoaudiologo_instituicao',
    })
    @ManyToMany(() => Institution, (institution) => institution.therapists)
    institutions: Institution[];

    @OneToMany(() => Orientation, (orientation) => orientation.therapist)
    orientations: Orientation;

    @OneToMany(() => Triage, (triage) => triage.therapist)
    triages: Triage;
}
