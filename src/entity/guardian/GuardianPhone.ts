import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PhoneTemplate as Phone } from '../decorators/templates/PhoneTemplate';
import { Guardian } from './Guardian';

@Entity('tel_responsavel')
export class GuardianPhone extends Phone {

    @JoinColumn({ name: 'fk_responsavel' })
    @ManyToOne(() => Guardian, (guardian) => guardian.phones, {
        nullable: false,
    })
    guardian: Guardian;

}
