import { Triage } from '../../../../../entity/triage/Triage';
import { BasicHeaderReportsDTO, TANReport } from './BasicHeaderReportsDTO';

interface TANOrientationReport extends TANReport {
    description: string,
}

export default class OrientationsReportsDTO extends BasicHeaderReportsDTO {
    public static fromTriageEntity(triage: Triage): OrientationsReportsDTO {
        return new OrientationsReportsDTO().fillWithTriageEntity(triage);
    }

    public fillWithTriageEntity(triage: Triage): OrientationsReportsDTO {
        super.fillWithTriageEntity(triage);
        this.tan = { ...this.tan, description: triage.orientation.description } as TANOrientationReport;
        return this;
    }
}
