import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import CityService from './CityService';

export default class CityController {
    public async getAll(params: {state?: number}) {
        const cityService = new CityService();

        const result = await cityService.getAll(params.state);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getById(params: {id: number}) {
        const cityService = new CityService();

        const result = await cityService.getById(params.id);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async updateCityZone(params: {id: number, zone: {id: number}}) {
        const cityService = new CityService();

        const result = await cityService.updateCityZone(params.id, params.zone.id);

        return { httpStatus: HttpStatus.OK, result };
    }
}
