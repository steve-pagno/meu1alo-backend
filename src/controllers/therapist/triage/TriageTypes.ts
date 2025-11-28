import { Triage } from '../../../entity/triage/Triage';
import { JwtUserInterface } from '../../../helpers/JwtAuth';

export interface TriageJwt extends Triage, JwtUserInterface {}

export interface QueryTriageDTO {
    leftEar?: number,
    rightEar?: number,
    evaluationDate?: Date,
    testType?: number
}
