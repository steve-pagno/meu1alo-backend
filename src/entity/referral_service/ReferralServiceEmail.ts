import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EmailTemplate as Email } from '../decorators/templates/EmailTemplate';
import { ReferralService } from './ReferralService';

@Entity('email_servico_referencia')
export class ReferralServiceEmail extends Email {

    @JoinColumn({ name: 'fk_servico' })
    @ManyToOne(() => ReferralService, (service) => service.emails, {
        nullable: false,
    })
    service: ReferralService;

}
