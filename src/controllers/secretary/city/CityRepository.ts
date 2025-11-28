import { City } from '../../../entity/secretaries/City';

export default class CityRepository {
    public async getAll(state?: number): Promise<City[]> {
        const query = City
            .createQueryBuilder('c')
            .select(['c.id AS id', 'c.name AS name'])
        ;
        if(state) {
            query.leftJoin('c.state', 's')
                .where('s.id = :state', { state })
            ;
        }
        return query.execute();
    }

    public async getById(id: number): Promise<City | null> {
        return City.findOne({ where: { id } });
    }

    public async updateCityZone(city: City): Promise<City> {
        return city.save();
    }

    public async getCitiesByZoneId(id: number): Promise<City[] | undefined> {
        return City.createQueryBuilder('c')
            .select(['c.id AS id', 'c.name AS name'])
            .where('c.zone = :zone',  { zone: id })
            .getRawMany()
        ;
    }

    public async getCitiesWithoutZoneByStateId(id: number): Promise<City[] | undefined> {
        return City.createQueryBuilder('c')
            .select(['c.id AS id', 'c.name AS name'])
            .where('c.state = :state',  { state: id })
            .andWhere('c.zone IS NULL')
            .getRawMany()
        ;
    }
}
