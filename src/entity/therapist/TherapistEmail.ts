import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EmailTemplate as Email } from '../decorators/templates/EmailTemplate';
import { Therapist } from './Therapist';

@Entity('email_fonoaudiologo')
export class TherapistEmail extends Email {

    @JoinColumn({ name: 'fk_fonoaudiologo' })
    @ManyToOne(() => Therapist, (therapist) => therapist.emails, {
        nullable: false,
    })
    therapist: Therapist;

}
