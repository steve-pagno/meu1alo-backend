import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserTemplate as User } from '../../decorators/templates/UserTemplate';
import { State } from '../State';
import { Zone } from '../Zone';
import { SecretaryEmail as Email } from './SecretaryEmail';
import { SecretaryPhone as Phone } from './SecretaryPhone';

@Entity('usuario_secretaria')
export class SecretaryUser extends User {

    @Column({
        comment: 'Cargo', length: 255, name: 'cargo',
        nullable: true, type: 'varchar'
    })
    role: string;

    @OneToMany(() => Email, (email) => email.user, {
        cascade: ['soft-remove', 'recover', 'remove'],
    })
    emails: Email[];

    @OneToMany(() => Phone, (phone) => phone.user, {
        cascade: ['soft-remove', 'recover', 'remove'],
    })
    phones: Phone[];

    @JoinColumn({ name: 'fk_secretaria_estado' })
    @ManyToOne(() => State, (state) => state.secretary.users)
    state: State;

    @JoinColumn({ name: 'fk_secretaria_regiao' })
    @ManyToOne(() => Zone, (zone) => zone.secretary.users)
    zone: Zone;
}
