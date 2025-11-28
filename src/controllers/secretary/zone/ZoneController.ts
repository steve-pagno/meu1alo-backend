import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import { SecretaryUser } from '../../../entity/secretaries/user/SecretaryUser';
import { JwtUserInterface } from '../../../helpers/JwtAuth';
import UserService from '../../users/UserService';
import CityService from '../city/CityService';
import SecretaryService from '../SecretaryService';
import ZoneService from './ZoneService';

export default class ZoneController {
    public async getAll(params: {stateId?: number}) {
        const zoneService = new ZoneService();

        const result = await zoneService.getAll(params.stateId);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getAllWithCities(params: JwtUserInterface) {
        const secretaryService = new SecretaryService();
        const zoneService = new ZoneService();
        const cityService = new CityService();

        const state = await secretaryService.getStateIdByUserId(params.jwtObject.id);
        const zones = await zoneService.getZonesByStateId(state);
        const result = await cityService.getCitiesWithAndWithoutZone(zones, state);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getById(params: {id: number}) {
        const zoneService = new ZoneService();

        const result = await zoneService.getById(params.id);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async createZoneUser(params: SecretaryUser) {
        const userService = new UserService();

        const result = await userService.save<SecretaryUser>('secretary', params);
        //TODO: salvar os emails e phones e testar essa rota melhor

        return { httpStatus: HttpStatus.OK, result };
    }

    public async deleteZone(params: {id: number}) {
        const zoneService = new ZoneService();

        const result = await zoneService.deleteZone(params.id);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async recoverZone(params: {id: number}) {
        const zoneService = new ZoneService();

        const result = await zoneService.recoverZone(params.id);

        return { httpStatus: HttpStatus.OK, result };
    }
}
