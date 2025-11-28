import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { State } from './State';
import { Zone } from './Zone';

/**
 * Município o qual a clínica se encontra.
 */
@Entity('municipio')
export class City extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'id_municipio' })
    id: number;

    @Column({ length: 48, name: 'nome', type: 'varchar', update: false })
    name: string;

    @JoinColumn({ name: 'fk_regiao' })
    @ManyToOne(() => Zone, (zone) => zone.cities, { nullable: true })
    zone: Zone;

    @JoinColumn({ name: 'fk_state' })
    @ManyToOne(() => State, (state) => state.cities, { nullable: false })
    state: State;

    @CreateDateColumn({ comment: 'Data de cadastro do município', name: 'data_cadastro',
        type: 'datetime',
    })
    registrationDate: Date;

}
