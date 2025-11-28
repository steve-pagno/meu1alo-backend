import { Triage, TriageString, TriageType } from '../../../entity/triage/Triage';
import { NotFoundOneTriageError } from './TriageErrors';
import TriageRepository from './TriageRepository';
import { QueryTriageDTO } from './TriageTypes';
import {EntityManager} from "typeorm/entity-manager/EntityManager";

export default class TriageService {
    private triageRepository: TriageRepository;

    constructor() {
        this.triageRepository = new TriageRepository();
    }

    public async create(triage: Triage, transaction?: EntityManager) {
        return this.triageRepository.create(triage, transaction);
    }

    public async triageTypes() {
        return Object.keys(TriageType).map((key) => (
            { id: key, name: TriageType[key as TriageString] }
        ));
    }

    public async getAll(params: QueryTriageDTO) {
        return this.triageRepository.getAll(params);
    }

    public async findById(id: number) {
        const triage = await this.triageRepository.findById(id);

        if(!triage) {
            throw new NotFoundOneTriageError();
        }

        return triage;
    }
}
