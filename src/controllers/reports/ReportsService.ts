import ReportsRepository from './ReportsRepository';

export default class ReportsService {
    private readonly reportsRepository: ReportsRepository;

    constructor() {
        this.reportsRepository = new ReportsRepository();
    }

    public async getBabiesPassFailSecretary(userID: number) {
        const institutionsIDs: number[] = await this.reportsRepository.getInstitutionsIDsOfSecretary(userID);
        return this.getBabiesPassFail(institutionsIDs);
    }
    public async getBabiesPassFailInstitution(userID: number) {
        const idInstitution = await this.reportsRepository.getInstitutionsIDsOfInstitutionUser(userID);
        const institutionsIDs: number[] = [idInstitution];
        return this.getBabiesPassFail(institutionsIDs);
    }
    public async getBabiesPassFailTherapist(userID: number) {
        const institutionsIDs: number[] = await this.reportsRepository.getInstitutionsIDsOfTherapist(userID);
        return this.getBabiesPassFail(institutionsIDs);
    }
    private async getBabiesPassFail(institutionsIDs: number[]) {
        const failsPromise = this.reportsRepository.failBabiesByInstitutions(institutionsIDs);
        const passPromise = this.reportsRepository.passBabiesByInstitutions(institutionsIDs);

        const result = await Promise.all([failsPromise, passPromise]);

        return {
            description: '',
            labels: ['Falhou', 'Passou'],
            quantities: result,
            title: 'Quantidade de bebes que passaram e falharam.'
        };
    }

    // public async getBabiesComeBorn(userType: string, userID: number) {
    //     const come = 10;
    //     const born = 5;
    //
    //     return {
    //         labels: ['Compareceram', 'Nasceram'],
    //         quantities: [come, born],
    //         title: 'Quantos compareceram para o teste e quantos que nasceram (vivos).',
    //     };
    // }

    public async getIndicatorsPercentSecretary(userID: number) {
        const institutionsIDs: number[] = await this.reportsRepository.getInstitutionsIDsOfSecretary(userID);
        return this.getIndicatorsPercent(institutionsIDs);
    }
    public async getIndicatorsPercentInstitution(userID: number) {
        const idInstitution = await this.reportsRepository.getInstitutionsIDsOfInstitutionUser(userID);
        const institutionsIDs: number[] = [idInstitution];
        return this.getIndicatorsPercent(institutionsIDs);
    }
    public async getIndicatorsPercentTherapist(userID: number) {
        const institutionsIDs: number[] = await this.reportsRepository.getInstitutionsIDsOfTherapist(userID);
        return this.getIndicatorsPercent(institutionsIDs);
    }
    private async getIndicatorsPercent(institutionsIDs: number[]) {
        const indicators = await this.reportsRepository.getIndicatorsPercentByInstitutions(institutionsIDs);
        const triagesTotal = await this.reportsRepository.getTriagesTotal(institutionsIDs);

        return {
            description: '',
            labels: indicators.map(indicator => indicator.name),
            quantities: indicators.map(indicator => indicator.total*100/triagesTotal),
            title: 'Porcentagem para cada indicador.'
        };
    }

    public async getIndicatorsSecretary(userID: number) {
        const institutionsIDs: number[] = await this.reportsRepository.getInstitutionsIDsOfSecretary(userID);
        return this.getIndicators(institutionsIDs);
    }
    public async getIndicatorsInstitution(userID: number) {
        const idInstitution = await this.reportsRepository.getInstitutionsIDsOfInstitutionUser(userID);
        const institutionsIDs: number[] = [idInstitution];
        return this.getIndicators(institutionsIDs);
    }
    public async getIndicatorsTherapist(userID: number) {
        const institutionsIDs: number[] = await this.reportsRepository.getInstitutionsIDsOfTherapist(userID);
        return this.getIndicators(institutionsIDs);
    }
    private async getIndicators(institutionsIDs: number[]) {
        const result = await this.reportsRepository.getIndicatorsByInstitutions(institutionsIDs);

        const { multiple, one, zero } = result || { multiple: 0, one: 0, zero: 0 };

        return {
            description: '(Relacionado a quantidade de indicadores selecionados no momento da consulta)',
            labels: ['Nenhum', 'Único', 'Múltiplo'],
            quantities: [zero, one, multiple],
            title: 'Nenhum, Único ou múltiplos Indicadores.'
        };
    }

    public async getEquipmentSecretary(userID: number) {
        const institutionsIDs: number[] = await this.reportsRepository.getInstitutionsIDsOfSecretary(userID);
        return this.getEquipment(institutionsIDs);
    }
    public async getEquipmentInstitution(userID: number) {
        const idInstitution = await this.reportsRepository.getInstitutionsIDsOfInstitutionUser(userID);
        const institutionsIDs: number[] = [idInstitution];
        return this.getEquipment(institutionsIDs);
    }
    public async getEquipmentTherapist(userID: number) {
        const institutionsIDs: number[] = await this.reportsRepository.getInstitutionsIDsOfTherapist(userID);
        return this.getEquipment(institutionsIDs);
    }
    private async getEquipment(institutionsIDs: number[]) {
        const equipments = await this.reportsRepository.getEquipmentByInstitutions(institutionsIDs);

        return {
            description: '(Para analise dos resultados comparando com os equipamentos)',
            labels: equipments.map(equipment => equipment.model),
            quantities: equipments.map(equipment => equipment.total),
            title: 'Quantidade de bebes que falharam por equipamento'
        };
    }
}
