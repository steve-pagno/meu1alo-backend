import { HttpStatus } from '../../helpers/http/AbstractHttpErrors';
import ReferralServiceService from './ReferralServiceService';

export default class ReferralServiceController {
    public async create(payload: any) {
        const referralServiceService = new ReferralServiceService();

        const result = await referralServiceService.create(payload);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async listType() {
        const referralServiceService = new ReferralServiceService();

        const result = await referralServiceService.listType();

        return { httpStatus: HttpStatus.OK, result };
    }
}
