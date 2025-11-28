import { ReferralService } from '../../entity/referral_service/ReferralService';

export default class ReferralServiceRepository {
    public async create(referralService: ReferralService) {
        return ReferralService.save(referralService);
    }
}
