import { Triage } from '../../../../../entity/triage/Triage';
import { BasicHeaderReportsDTO } from './BasicHeaderReportsDTO';

export default class HistoricSerieReportsDTO extends BasicHeaderReportsDTO {
    public static fromTriageEntity(triage: Triage): HistoricSerieReportsDTO {
        return new HistoricSerieReportsDTO().fillWithTriageEntity(triage);
    }

    public fillWithTriageEntity(triage: Triage): HistoricSerieReportsDTO {
        super.fillWithTriageEntity(triage);
        return this;
    }
}
