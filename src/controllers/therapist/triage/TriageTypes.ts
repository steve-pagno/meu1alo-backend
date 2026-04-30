import { Baby } from '../../../entity/baby/Baby';
import { Conduct } from '../../../entity/conduct/Conduct';
import { Equipment } from '../../../entity/equipment/Equipment';
import { Indicator } from '../../../entity/indicator/Indicator';
import { Institution } from '../../../entity/institution/Institution';
import { Orientation } from '../../../entity/orientation/Orientation';
import { Therapist } from '../../../entity/therapist/Therapist';
import { TriageType } from '../../../entity/triage/Triage';
import { JwtUserInterface } from '../../../helpers/JwtAuth';

export interface TriageJwt extends JwtUserInterface {
    id?: number;
    leftEar: boolean;
    rightEar: boolean;
    evaluationDate: Date;
    eoaLeftEar?: boolean | null;
    eoaRightEar?: boolean | null;
    peateaLeftEar?: boolean | null;
    peateaRightEar?: boolean | null;
    type: TriageType | string;
    observation: string;
    equipment: Equipment;
    conduct: Conduct;
    orientation: Orientation;
    institution: Institution;
    baby: Baby;
    therapist?: Therapist;
    indicators?: Array<number | Indicator>;
    testType?: number;
}

export interface QueryTriageDTO {
    leftEar?: number;
    rightEar?: number;
    evaluationDate?: Date;
    testType?: number;
    babyName?: string;
    responsibleName?: string;
}