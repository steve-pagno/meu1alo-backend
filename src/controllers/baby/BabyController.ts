import { HttpStatus } from '../../helpers/http/AbstractHttpErrors';
import { ResponseHttpController } from '../../helpers/http/AbstractRoutesTypes';
import BabyService from './BabyService';

export default class BabyController {
    public async listChildBirthTypes(): Promise<ResponseHttpController>{
        const babyService = new BabyService();

        const result = await babyService.listChildBirthTypes();
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getAllBabies(): Promise<ResponseHttpController> {
        const babyService = new BabyService();

        const result = await babyService.getAllBabies();
        return { httpStatus: HttpStatus.OK, result };
    }
}
