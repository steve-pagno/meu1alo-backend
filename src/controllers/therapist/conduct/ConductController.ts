import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import { Conduct } from '../../../entity/conduct/Conduct';
import { Therapist } from '../../../entity/therapist/Therapist';
import ConductService from './ConductService';
import { ConductGetParamsInterface, ConductGetParamsInterfaceRequired, ConductJwt } from './ConductTypes';

export default class ConductController {
    public async create(params: ConductJwt) {
        const conductService = new ConductService();

        const therapistId = params.jwtObject.id;

        const conduct = params as Conduct;
        conduct.therapist = { id: therapistId } as Therapist;
        const result = await conductService.create(conduct);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getAll(params: ConductGetParamsInterface) {
        const conductService = new ConductService();

        const { irda, leftEar, rightEar, testType } = params;
        const result = await conductService.getAll(leftEar, rightEar, irda, testType);

        console.log('result', result);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async get(params: ConductGetParamsInterfaceRequired) {
        const conductService = new ConductService();

        const { irda, leftEar, rightEar, testType } = params;
        const result = await conductService.get(leftEar, rightEar, irda, testType);

        return { httpStatus: HttpStatus.OK, result };
    }

}
