import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EmailTemplate as Email } from '../decorators/templates/EmailTemplate';
import { InstitutionUser } from './InstitutionUser';

@Entity('email_instituicao')
export class InstitutionEmail extends Email {

    @JoinColumn({ name: 'fk_instituicao' })
    @ManyToOne(() => InstitutionUser, (user) => user.emails, {
        nullable: false,
    })
    user: InstitutionUser;

}
