export interface ChildBirthIdName{
    id: string;
    name: ChildBirth;
}

/**
 * Tipos de parto aceitos pelo sistema
 */
export type ChildBirthString = 'CESAREAN' | 'NATURAL' | 'VACUUM' | 'FORCEPS' | 'WATER';

export enum ChildBirth {
    CESAREAN = 'Parto Cirúrgico (Cesárea)',
    NATURAL = 'Parto Vaginal Natural',
    VACUUM = 'Parto Vaginal com Extrator a vácuo',
    FORCEPS = 'Parto Vaginal com Fórceps',
    WATER = 'Parto na água',
}
