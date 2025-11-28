import { ReferralService, ReferralServiceType, ReferralServiceTypeString } from '../../entity/referral_service/ReferralService';
import ReferralServiceRepository from './ReferralServiceRepository';

export default class ReferralServiceService {
    private readonly referralServiceRepository: ReferralServiceRepository;

    constructor() {
        this.referralServiceRepository = new ReferralServiceRepository();
    }

    public async create(referralService: ReferralService) {
        if(referralService.cnpj && referralService.cnpj.length > 14) {
            referralService.cnpj = referralService.cnpj
                .replaceAll('.', '')
                .replaceAll('-', '')
                .replaceAll('/', '');
        }
        return this.referralServiceRepository.create(referralService);
    }

    public async listType() {
        return Object.keys(ReferralServiceType).map((key) => (
            { id: key, name: ReferralServiceType[key as ReferralServiceTypeString] }
        ));
    }
}
