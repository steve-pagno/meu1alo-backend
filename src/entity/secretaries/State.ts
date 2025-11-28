import { ValidateNested, validateOrReject } from 'class-validator';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SecretaryComponent as Secretary } from '../decorators/components/Secretary';
import { City } from './City';
import { Zone } from './Zone';

@Entity('estado')
export class State extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'id_estado' })
    id: number;

    @Column({ name: 'codigo_ibge', type: 'int', unique: true, update: false })
    code: number;

    @Column({ length: 20, name: 'nome', type: 'varchar', update: false })
    name: string;

    @Column({ length: 2, name: 'uf', type: 'varchar', unique: true, update: false })
    uf: string;

    @ValidateNested()
    @Column(() => Secretary, { prefix: 'secretaria' })
    secretary: Secretary;

    @OneToMany(() => Zone, (zone) => zone.state, {
        cascade: ['soft-remove', 'recover', 'remove'],
    })
    zones: Zone[];

    @OneToMany(() => City, (city) => city.state)
    cities: City[];

    @BeforeInsert()
    @BeforeUpdate()
    private validate(): Promise<void> {
        return validateOrReject(this);
    }

}
