import { City } from '../../../entity/secretaries/City';
import { Zone } from '../../../entity/secretaries/Zone';
import { NotFoundCityError } from './CityErrors';
import CityRepository from './CityRepository';

export interface GetCitiesWithAndWithoutZoneContract { id: number, name: string, values: City[] }

export default class CityService {
    private cityRepository: CityRepository;

    constructor() {
        this.cityRepository = new CityRepository();
    }

    public async getAll(state?: number): Promise<City[]> {
        return this.cityRepository.getAll(state);
    }

    public async getById(id: number): Promise<City> {
        const city = await this.cityRepository.getById(id);
        if (!city) {
            throw new NotFoundCityError();
        }
        return city;
    }

    public async updateCityZone(cityId: number, zoneId: number): Promise<City> {
        const city = await this.getById(cityId);

        city.zone = { id: zoneId } as Zone;
        return this.cityRepository.updateCityZone(city);
    }

    public async getCitiesWithAndWithoutZone(zones: any[] | undefined, stateId: number): Promise<GetCitiesWithAndWithoutZoneContract[]> {
        const promises: Promise<GetCitiesWithAndWithoutZoneContract>[] = [];
        for (const zone of zones || []) {
            promises.push(this.getCitiesByZoneId(zone));
        }
        promises.push(this.getCitiesWithoutZoneByStateId(stateId));

        return Promise.all(promises);
    }

    private async getCitiesByZoneId(zone: any): Promise<GetCitiesWithAndWithoutZoneContract> {
        const values = await this.cityRepository.getCitiesByZoneId(zone.id);
        return { ...zone,  values };
    }

    private async getCitiesWithoutZoneByStateId(stateId: number): Promise<GetCitiesWithAndWithoutZoneContract> {
        const notLinked = await this.cityRepository.getCitiesWithoutZoneByStateId(stateId);
        return { id: 0, name: 'Cidades não vinculadas', values: notLinked || [] };
    }
}
