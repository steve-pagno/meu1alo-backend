import { Triage } from '../../../entity/triage/Triage';
import { QueryTriageDTO } from './TriageTypes';
import {EntityManager} from "typeorm/entity-manager/EntityManager";

export default class TriageRepository {
    public async create(triage: Triage, transaction?: EntityManager): Promise<Triage> {
        if(transaction) {
            return transaction.getRepository(Triage).save(triage);
        }
        return Triage.save(triage);
    }

    public async update(id: number, triage: Triage, transaction?: EntityManager): Promise<Triage> {
        const triageToSave = { ...triage, id } as Triage;
        if(transaction) {
            return transaction.getRepository(Triage).save(triageToSave);
        }
        return Triage.save(triageToSave);
    }

    public async getAll(query: QueryTriageDTO): Promise<Triage[]> {
        let triageQuery = Triage.createQueryBuilder('triage')
            .select([
                'triage.id AS id',
                'triage.leftEar AS leftEar', 'triage.rightEar AS rightEar',
                'triage.evaluationDate AS evaluationDate', 'triage.type AS type',
                'conduct.resultDescription AS conduct',
                'institution.institutionName AS institution',
                'conduct.testType AS testType',
                'baby.name AS babyName',
                'birthMother.name AS responsibleName'
            ])
            .leftJoin('triage.conduct', 'conduct')
            .leftJoin('triage.institution', 'institution')
            .leftJoin('triage.therapist', 'therapist')
            .leftJoin('triage.baby', 'baby')
            .leftJoin('baby.birthMother', 'birthMother')
            .where('therapist.id = :therapistId', { therapistId: query.jwtObject?.id });

        if(query.rightEar && String(query.rightEar) !== '4'){
            triageQuery = triageQuery.andWhere('triage.rightEar = :rightEar', { rightEar: query.rightEar });
        }

        if(query.leftEar && String(query.leftEar) !== '4'){
            triageQuery = triageQuery.andWhere('triage.leftEar = :leftEar', { leftEar: query.leftEar });
        }

        if(query.evaluationDate){
            triageQuery = triageQuery.andWhere('triage.evaluationDate like :evaluationDate', { evaluationDate: `%${query.evaluationDate}%` });
        }

        if(query.testType && String(query.testType) !== '4'){
            triageQuery = triageQuery.andWhere('conduct.testType = :testType', { testType: query.testType });
        }

        if(query.babyName){
            triageQuery = triageQuery.andWhere('baby.name LIKE :babyName', { babyName: `%${query.babyName}%` });
        }

        if(query.responsibleName){
            triageQuery = triageQuery.andWhere('birthMother.name LIKE :responsibleName', { responsibleName: `%${query.responsibleName}%` });
        }

        if(query.therapistName){
            triageQuery = triageQuery.andWhere('therapist.name LIKE :therapistName', { therapistName: `%${query.therapistName}%` });
        }

        let institutionIds: number[] = [];
        if (query.institutionIds) {
            const raw = query.institutionIds as any;
            if (Array.isArray(raw)) {
                institutionIds = raw.map(id => Number(id)).filter(id => !isNaN(id));
            } else if (typeof raw === 'string') {
                institutionIds = raw.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
            } else if (!isNaN(Number(raw))) {
                institutionIds = [Number(raw)];
            }
        }

        if (institutionIds.length > 0) {
            triageQuery = triageQuery.andWhere('institution.id IN (:...institutionIds)', { institutionIds });
        }

        return triageQuery.getRawMany();
    }

    public async getAllByInstitution(institutionId: number, query: QueryTriageDTO): Promise<Triage[]> {
        let triageQuery = Triage.createQueryBuilder('triage')
            .select([
                'triage.id AS id',
                'triage.leftEar AS leftEar', 'triage.rightEar AS rightEar',
                'triage.evaluationDate AS evaluationDate', 'triage.type AS type',
                'conduct.resultDescription AS conduct',
                'institution.institutionName AS institution',
                'conduct.testType AS testType',
                'baby.name AS babyName',
                'birthMother.name AS responsibleName',
                'therapist.name AS therapistName'
            ])
            .leftJoin('triage.conduct', 'conduct')
            .leftJoin('triage.institution', 'institution')
            .leftJoin('triage.therapist', 'therapist')
            .leftJoin('triage.baby', 'baby')
            .leftJoin('baby.birthMother', 'birthMother')
            .where('institution.id = :institutionId', { institutionId });

        if(query.rightEar && String(query.rightEar) !== '4'){
            triageQuery = triageQuery.andWhere('triage.rightEar = :rightEar', { rightEar: query.rightEar });
        }

        if(query.leftEar && String(query.leftEar) !== '4'){
            triageQuery = triageQuery.andWhere('triage.leftEar = :leftEar', { leftEar: query.leftEar });
        }

        if(query.evaluationDate){
            triageQuery = triageQuery.andWhere('triage.evaluationDate like :evaluationDate', { evaluationDate: `%${query.evaluationDate}%` });
        }

        if(query.testType && String(query.testType) !== '4'){
            triageQuery = triageQuery.andWhere('conduct.testType = :testType', { testType: query.testType });
        }

        if(query.babyName){
            triageQuery = triageQuery.andWhere('baby.name LIKE :babyName', { babyName: `%${query.babyName}%` });
        }

        if(query.responsibleName){
            triageQuery = triageQuery.andWhere('birthMother.name LIKE :responsibleName', { responsibleName: `%${query.responsibleName}%` });
        }

        if(query.therapistName){
            triageQuery = triageQuery.andWhere('therapist.name LIKE :therapistName', { therapistName: `%${query.therapistName}%` });
        }

        return triageQuery.getRawMany();
    }

    public async findById(id: number): Promise<Triage | null> {
        return Triage.findOne({
            relations: [
                'baby',
                'baby.birthMother',
                'baby.birthMother.address.city',
                'baby.birthMother.address.city.state',
                'baby.birthMother.emails',
                'baby.birthMother.phones',
                'baby.guardians',
                'baby.guardians.address.city',
                'baby.guardians.address.city.state',
                'baby.guardians.emails',
                'baby.guardians.phones',
                'equipment',
                'orientation',
                'conduct',
                'indicators',
                'institution',
                'therapist'
            ],
            where: {
                id
            }
        });
    }
}
