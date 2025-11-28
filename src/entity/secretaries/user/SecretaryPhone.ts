import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PhoneTemplate as Phone } from '../../decorators/templates/PhoneTemplate';
import { SecretaryUser } from './SecretaryUser';

@Entity('tel_secretaria')
export class SecretaryPhone extends Phone {

    @JoinColumn({ name: 'fk_secretaria' })
    @ManyToOne(() => SecretaryUser, (user) => user.phones, {
        nullable: false,
    })
    user: SecretaryUser;

}
