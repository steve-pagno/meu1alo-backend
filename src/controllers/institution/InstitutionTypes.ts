export interface InstitutionPayload {
    id: number;
    institutionType: InstitutionString | InstitutionType;
    cnes: string;
    cnpj: string;
    institutionName: string;
}

export type InstitutionString = 'HOSPITAL' | 'MATERNITY' | 'HOSPITAL_AND_MATERNITY';
export enum InstitutionType
{
    HOSPITAL = 'Hospital',
    MATERNITY = 'Maternidade',
    HOSPITAL_AND_MATERNITY = 'Hospital e Maternidade',
}
