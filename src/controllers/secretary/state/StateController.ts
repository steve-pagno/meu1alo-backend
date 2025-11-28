import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import StateService from './StateService';

export default class StateController {
    public async getAll() {
        const stateService = new StateService();

        const result = await stateService.getAll();

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getById(params: {id: number}) {
        const stateService = new StateService();

        const result = await stateService.getById(params.id);

        return { httpStatus: HttpStatus.OK, result };
    }
}
