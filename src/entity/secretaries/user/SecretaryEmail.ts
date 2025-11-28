import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EmailTemplate as Email } from '../../decorators/templates/EmailTemplate';
import { SecretaryUser } from './SecretaryUser';

@Entity('email_secretaria')
export class SecretaryEmail extends Email {

    @JoinColumn({ name: 'fk_usuario' })
    @ManyToOne(() => SecretaryUser, (user) => user.emails, {
        nullable: false,
    })
   user: SecretaryUser;

}
