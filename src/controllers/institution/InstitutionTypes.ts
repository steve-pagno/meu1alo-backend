export interface InstitutionPayload {
    id?: number;
    institutionType: InstitutionString | InstitutionType;
    cnes: string;
    cnpj: string;
    institutionName: string;
    // Estrutura para receber os dados do ViaCEP
    address?: {
        street: string;
        number: number;
        adjunct?: string;
        cep: string;
        city_name: string;
        state_uf: string;
    };
}

export type InstitutionString = 'HOSPITAL' | 'MATERNITY' | 'HOSPITAL_AND_MATERNITY';

export enum InstitutionType {
    HOSPITAL = 'Hospital',
    MATERNITY = 'Maternidade',
    HOSPITAL_AND_MATERNITY = 'Hospital e Maternidade',
}