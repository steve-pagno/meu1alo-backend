import { IsEmail } from 'class-validator';
import { Column, OneToMany } from 'typeorm';
import { SecretaryUser as User } from '../../secretaries/user/SecretaryUser';

/**
 * Componente de Secretaria.
 *
 * Este é um componente de Secretaria que é anexado ao estado ou à secretaria.
 */
export class SecretaryComponent {

    @Column({ comment: 'Rua em que se encontra esse endereço', length: 255, name: 'nome', nullable: true,
        type: 'varchar',
    })
    name: string;

    @IsEmail({}, { each: true })
    @Column({ comment: 'Endereços de email para contato', name: 'emails', nullable: true,
        type: 'simple-array',
    })
    emails?: string[];

    @OneToMany(() => User, (user) => user.zone ? user.zone : user.state)
    users?: User[];

}
