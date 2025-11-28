import { Triage } from '../../../../../entity/triage/Triage';
import { BasicHeaderReportsDTO } from './BasicHeaderReportsDTO';

interface ConductTestReports {
    resultDescription: string;
    accompanyDescription: string;
}

interface OrientationTestReports {
    description: string;
}

export default class TestReportsDTO extends BasicHeaderReportsDTO {
    private conduct: ConductTestReports;
    private orientation: OrientationTestReports;

    public static fromTriageEntity(triage: Triage): TestReportsDTO {
        return new TestReportsDTO().fillWithTriageEntity(triage);
    }

    public fillWithTriageEntity(triage: Triage): TestReportsDTO {
        super.fillWithTriageEntity(triage);
        this.conduct = {
            accompanyDescription: triage.conduct.accompanyDescription,
            resultDescription: triage.conduct.resultDescription,
        };
        this.orientation = {
            description: triage.orientation.description,
        };
        return this;
    }
}
