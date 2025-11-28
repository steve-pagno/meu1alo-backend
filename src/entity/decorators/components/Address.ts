import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { City } from '../../secretaries/City';

/**
 * Componente de Endereço.
 *
 * Este é um componente genérico que pode ser usado como coluna de uma tabela.
 */
export class AddressComponent {

    @Column({ comment: 'Rua em que se encontra esse endereço', length: 255, name: 'rua',
        type: 'varchar',
    })
    street: string;

    @Column({ comment: 'Numero do estabelecimento', name: 'numero',
        type: 'int',
    })
    number: number;

    @Column({ comment: 'Complemento para o endereço', length: 255, name: 'complemento', nullable: true,
        type: 'varchar',
    })
    adjunct: string;

    @Column({ comment: 'CEP do endereço', length: 8, name: 'CEP',
        type: 'varchar',
    })
    cep: string;

    @JoinColumn({ name: 'fk_municipio' })
    @ManyToOne(() => City, { nullable: false })
    city: City;

}
