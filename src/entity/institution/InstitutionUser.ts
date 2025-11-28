import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserTemplate as User } from '../decorators/templates/UserTemplate';
import { Institution } from './Institution';
import { InstitutionEmail as Email } from './InstitutionEmail';
import { InstitutionPhone as Phone } from './InstitutionPhone';

@Entity('usuario_instituicao')
export class InstitutionUser extends User {

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

    @JoinColumn({ name: 'fk_instituicao' })
    @ManyToOne(() => Institution, (institution) => institution.users, { nullable: false })
    institution: Institution;

}
