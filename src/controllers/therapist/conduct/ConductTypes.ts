import { Conduct } from '../../../entity/conduct/Conduct';
import { JwtUserInterface } from '../../../helpers/JwtAuth';

export interface ConductGetParamsInterface {
    leftEar?: number,
    rightEar?: number,
    irda?: number,
    testType?: number
}

export interface ConductGetParamsInterfaceRequired {
    leftEar: number,
    rightEar: number,
    irda: number,
    testType: number
}

export interface ConductJwt extends Conduct, JwtUserInterface {}
