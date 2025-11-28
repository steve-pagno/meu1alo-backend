import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Triage } from '../triage/Triage';

@Entity('equipamento')
export class Equipment extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id_equipamento' })
    id: number;

    @Column({ comment: 'Modelo do equipamento', length: 255, name: 'modelo',
        type: 'varchar',
    })
    model: string;

    @Column({ comment: 'Marca do equipamento', length: 255, name: 'marca',
        type: 'varchar',
    })
    brand: string;

    @Column({ comment: 'Data do último calibramento do equipamento', name: 'data_calibracao',
        type: 'date',
    })
    dateOfLastCalibration: Date;

    @Column({ comment: 'Data de desativação do equipamento', default: null,
        name: 'data_desativacao',
        nullable: true,
        type: 'date'
    })
    dateOfDeactivation: Date;

    @OneToMany(() => Triage, (triage) => triage.therapist)
    triages: Triage;
}
