import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany, OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ChildBirth } from '../../controllers/baby/BabyTypes';
import { Guardian } from '../guardian/Guardian';
import { Triage } from '../triage/Triage';

/**
 * Bebê que será submetido aos exames e, eventualmente,
 * encaminhado a um serviço de referência.
 */
@Entity('bebe')
export class Baby extends BaseEntity {

    @PrimaryGeneratedColumn({ comment: 'Chave primária do bebê',
        name: 'id_bebe',
    })
    id: number;

    @Column({
        comment: 'Nome', length: 255, name: 'nome',
        nullable: false, type: 'varchar'
    })
    name: string;

    @Column({ comment: 'Peso do bebê', name: 'peso',
        type: 'float',
    })
    weight: number;

    @Column({ comment: 'Altura do bebê', name: 'altura',
        type: 'float',
    })
    height: number;

    @Column({ comment: 'Circunferência da cabeça do bebê', name: 'circunferencia',
        type: 'float',
    })
    circumference: number;

    @Column({ comment: 'Data de nascimento do responsável (para cálculo de idade e afins)', name: 'data_nascimento', type: 'datetime',
        update: false,
    })
    birthDate: Date;

    @Column({ comment: 'Tempo de duração da gestação do bebê marcado em semanas', name: 'idade_gestacional', type: 'int',
        update: false,
    })
    gestationalAge: number;

    @Column({ comment: 'Tipo do parto do bebê', enum: ChildBirth, name: 'tipo_parto', type: 'enum',
        update: false,
    })
    childBirthType: ChildBirth;

    @Column({ comment: 'Obito materno', name: 'obito_materno', type: 'boolean',
        update: false,
    })
    maternalDeath: boolean;

    // Controle

    @CreateDateColumn({ comment: 'Data de cadastro do bebê', name: 'data_cadastro',
        type: 'datetime',
    })
    registrationDate: Date;

    @DeleteDateColumn({ comment: 'Coluna usada para o Soft Delete, caso tenha um valor, o serviço de referencia foi inativado nessa data', name: 'data_desativado', nullable: true,
        type: 'datetime',
    })
    disableDate: Date;

    // Relacionamentos

    @JoinColumn({ name: 'fk_mae_bio' })
    @OneToOne(() => Guardian, {
        nullable: false,
    })
    birthMother: Guardian;

    @JoinTable ({ inverseJoinColumn: { name: 'fk_responsavel' },
        joinColumn: { name: 'fk_bebe' }, name: 'bebe_responsavel',
    })
    @ManyToMany(() => Guardian, (guardian) => guardian.ward)
    guardians: Guardian[];

    @OneToMany(() => Triage, (triage) => triage.therapist)
    triages: Triage[];
}
