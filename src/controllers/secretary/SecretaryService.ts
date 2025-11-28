import SecretaryRepository from './SecretaryRepository';

export default class SecretaryService {
    private secretaryRepository: SecretaryRepository;

    constructor() {
        this.secretaryRepository = new SecretaryRepository();
    }

    public async getDashboard() {
        return [
            { type: 'baby-pass-fail' },
            // { type: 'baby-come-born' },
            { type: 'indicators-percent' },
            { type: 'indicators' }
        ];
    }

    public async getIsState(id: number) {
        const result = await this.secretaryRepository.getState(id);
        return result && result.state;
    }

    public async getStateIdByUserId(id: number) {
        const result = await this.secretaryRepository.getState(id);
        return result?.state;
    }
}
