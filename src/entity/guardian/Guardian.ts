import { ValidateNested } from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Baby } from '../baby/Baby';
import { AddressComponent as Address } from '../decorators/components/Address';
import { UserTemplate as User } from '../decorators/templates/UserTemplate';
import { GuardianEmail as Email } from './GuardianEmail';
import { GuardianPhone as Phone } from './GuardianPhone';

@Entity('responsavel')
export class Guardian extends User {

    @Column({ comment: 'Data de nascimento do responsável (para cálculo de idade e afins)', name: 'data_nascimento', type: 'date',
        update: false,
    })
    birthDate: Date;

    @Column({ comment: 'CPF do responsável', length: 11, name: 'cpf', nullable: true,
        type: 'varchar',
    })
    cpf: string;

    @ValidateNested()
    @Column(() => Address, { prefix: false })
    address: Address;

    // Relacionamentos

    @ManyToMany(() => Baby, (baby) => baby.guardians)
    ward: Baby[];

    @OneToMany(() => Email, (email) => email.guardian, {
        cascade: ['soft-remove', 'recover', 'remove'],
    })
    emails: Email[];

    @OneToMany(() => Phone, (phone) => phone.guardian, {
        cascade: ['soft-remove', 'recover', 'remove'],
    })
    phones: Phone[];

}
