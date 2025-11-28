import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PhoneTemplate as Phone } from '../decorators/templates/PhoneTemplate';
import { InstitutionUser } from './InstitutionUser';

@Entity('tel_instituicao')
export class InstitutionPhone extends Phone {

    @JoinColumn({ name: 'fk_instituicao' })
    @ManyToOne(() => InstitutionUser, (user) => user.phones, {
        nullable: false,
    })
    user: InstitutionUser;

}
