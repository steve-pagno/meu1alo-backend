import ParentsRepository from './ParentsRepository';

export default class ParentsService {
    private repository: ParentsRepository;

    constructor() {
        this.repository = new ParentsRepository();
    }

    public async getDashboard() {
        return [];
    }

    public async getTriagesByGuardianId(guardianId: number) {
        return this.repository.getTriagesByGuardianId(guardianId);
    }
}