import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PhoneTemplate as Phone } from '../decorators/templates/PhoneTemplate';
import { Therapist } from './Therapist';

@Entity('tel_fonoaudiologo')
export class TherapistPhone extends Phone {

    @JoinColumn({ name: 'fk_fonoaudiologo' })
    @ManyToOne(() => Therapist, (therapist) => therapist.phones, {
        nullable: false,
    })
    therapist: Therapist;

}
