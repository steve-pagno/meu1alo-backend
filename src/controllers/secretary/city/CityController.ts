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

    // <-- AQUI ESTÁ A CORREÇÃO DA TIPAGEM (Adicionado o '?' e o '| null')
    public async updateCityZone(params: {id: number, zone?: {id: number} | null}) {
        const cityService = new CityService();

        // Extrai o ID da região de forma segura se o zone existir, senão passa null
        const zoneId = params.zone ? params.zone.id : null;

        const result = await cityService.updateCityZone(params.id, zoneId);

        return { httpStatus: HttpStatus.OK, result };
    }
}