import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EmailTemplate as Email } from '../decorators/templates/EmailTemplate';
import { Guardian } from './Guardian';

@Entity('email_responsavel')
export class GuardianEmail extends Email {

    @JoinColumn({ name: 'fk_responsavel' })
    @ManyToOne(() => Guardian, (guardian) => guardian.emails, {
        nullable: false,
    })
    guardian: Guardian;

}
