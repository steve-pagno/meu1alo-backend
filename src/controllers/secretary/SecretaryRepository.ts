import { SecretaryUser } from '../../entity/secretaries/user/SecretaryUser';

export default class SecretaryRepository {
    public async getDashboard() {
        return [
            { type: 'baby-pass-fail' },
            // { type: 'baby-come-born' },
            { type: 'indicators-percent' },
            { type: 'indicators' }
        ];
    }

    public async getState(userId: number) {
        return SecretaryUser.createQueryBuilder('u')
            .select(['u.state AS state'])
            .where('u.id = :id', { id: userId })
            .getRawOne()
        ;
    }
}
