import { HttpStatus } from '../../helpers/http/AbstractHttpErrors';
import { ReferralService } from '../../entity/referral_service/ReferralService';
import ReferralServiceService from './ReferralServiceService';

export default class ReferralServiceController {
    public async create(referralService: ReferralService) {
        const referralServiceService = new ReferralServiceService();

        const result = referralServiceService.create(referralService);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async listType() {
        const referralServiceService = new ReferralServiceService();

        const result = await referralServiceService.listType();

        return { httpStatus: HttpStatus.OK, result };
    }
}
