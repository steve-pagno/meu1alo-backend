import { Indicator } from '../../../entity/indicator/Indicator';
import IndicatorRepository from './IndicatorRepository';
import { QueryIndicatorJwt } from './IndicatorTypes';

export default class IndicatorService{
    private indicatorRepository: IndicatorRepository;

    constructor() {
        this.indicatorRepository = new IndicatorRepository();
    }

    public async create(indicator: Indicator) {
        return this.indicatorRepository.create(indicator);
    }

    public async getAll(params: QueryIndicatorJwt): Promise<Indicator[] | undefined>{
        return this.indicatorRepository.getAll(params);
    }
}
