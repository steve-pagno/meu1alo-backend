
export interface TherapistIdName{
    id: string;
    name: TherapistXP;
}

export type TherapistXPString = 'LESS_ONE' | 'ONE_TO_THREE' | 'THREE_TO_FIVE' | 'MORE_FIVE';

export enum TherapistXP {
    LESS_ONE = 'Menos de 1 ano',
    ONE_TO_THREE = 'De 1 a 3 anos',
    THREE_TO_FIVE = 'De 3 a 5 anos',
    MORE_FIVE = 'Mais de 5 anos',
}
