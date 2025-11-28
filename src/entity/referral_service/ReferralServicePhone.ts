import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PhoneTemplate as Phone } from '../decorators/templates/PhoneTemplate';
import { ReferralService } from './ReferralService';

@Entity('tel_servico_referencia')
export class ReferralServicePhone extends Phone {

    @JoinColumn({ name: 'fk_servico' })
    @ManyToOne(() => ReferralService, (service) => service.phones, {
        nullable: false,
    })
    service: ReferralService;

}
