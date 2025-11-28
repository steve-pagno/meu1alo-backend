import { HttpStatus } from '../../helpers/http/AbstractHttpErrors';
import SecretaryService from './SecretaryService';

export default class SecretaryController {
    public async getDashboard() {
        const secretaryService = new SecretaryService();

        const result = await secretaryService.getDashboard();
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getIsState(params: {id: number}) {
        const secretaryService = new SecretaryService();

        const result = await secretaryService.getIsState(params.id);
        return { httpStatus: HttpStatus.OK, result };
    }
}
