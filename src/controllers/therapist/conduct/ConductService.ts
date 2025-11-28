import { Conduct } from '../../../entity/conduct/Conduct';
import ConductRepository from './ConductRepository';


export default class ConductService {
    private conductRepository: ConductRepository;

    constructor() {
        this.conductRepository = new ConductRepository();
    }

    public async create(conduct: Conduct): Promise<Conduct>{
        return this.conductRepository.save(conduct as Conduct);
    }

    public async get(leftEar: number, rightEar: number, irda: number, testType: number): Promise<Conduct | undefined>{
        return this.conductRepository.get(leftEar, rightEar, irda, testType);
    }

    public async getAll(leftEar?: number, rightEar?: number, irda?: number, testType?: number): Promise<Conduct[] | undefined>{
        return this.conductRepository.getAll(leftEar, rightEar, irda, testType);
    }
}
