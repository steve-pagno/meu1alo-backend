import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import { Indicator } from '../../../entity/indicator/Indicator';
import { Therapist } from '../../../entity/therapist/Therapist';
import IndicatorService from './IndicatorService';
import { IndicatorJwt, QueryIndicatorJwt } from './IndicatorTypes';

export default class IndicatorController {
    public async create(params: IndicatorJwt) {
        const indicatorService = new IndicatorService();

        const therapistId = params.jwtObject.id;

        const indicator = params as Indicator;
        indicator.therapist = { id: therapistId } as Therapist;

        const result = await indicatorService.create(indicator);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getAll(params: QueryIndicatorJwt) {
        const indicatorService = new IndicatorService();

        const result = await indicatorService.getAll(params);

        return { httpStatus: HttpStatus.OK, result };
    }

}
