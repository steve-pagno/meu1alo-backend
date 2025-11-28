import { Indicator } from '../../../entity/indicator/Indicator';
import { QueryIndicatorJwt } from './IndicatorTypes';

export default class IndicatorRepository {
    public async create(indicator: Indicator) {
        return Indicator.save(indicator);
    }

    public getAll(params: QueryIndicatorJwt): Promise<Indicator[] | undefined>{
        const query = Indicator.createQueryBuilder('indicator')
            .select(['indicator.id  AS id', 'indicator.name AS name'])
            .where('indicator.therapist = :id', { id: params.jwtObject.id })
            .orWhere('indicator.therapist is null').orderBy('indicator.name','ASC');

        if(params.name){
            query.andWhere('indicator.name like :name', { name: `%${params.name}%` });
        }
        return query.getRawMany();
    }
}
