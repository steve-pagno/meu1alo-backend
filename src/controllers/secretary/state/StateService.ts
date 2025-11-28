import StateRepository from './StateRepository';

export default class StateService {
    private stateRepository: StateRepository;

    constructor() {
        this.stateRepository = new StateRepository();
    }

    public async getAll() {
        return this.stateRepository.getAll();
    }

    public async getById(id: number) {
        const state = await this.stateRepository.getById(id);
        if (!state) {
            //TODO: throws error NOT_FOUND 'ID não encontrado'
        }
        return state;
    }
}
