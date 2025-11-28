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

    public async getAll(query: QueryTriageDTO): Promise<Triage[]> {
        let triageQuery = Triage.createQueryBuilder('triage')
            .select([
                'triage.id AS id',
                'triage.leftEar AS leftEar', 'triage.rightEar AS rightEar',
                'triage.evaluationDate AS evaluationDate', 'triage.type AS type',
                'conduct.resultDescription AS conduct',
                'institution.institutionName AS institution, conduct.testType AS testType'
            ])
            .leftJoin('triage.conduct', 'conduct')
            .leftJoin('triage.institution', 'institution')
            .leftJoin('triage.therapist', 'therapist')
            .leftJoin('therapist.institutions', 'therapistInstitutions')
            .where('triage.institution = therapistInstitutions.id');

        if(query.rightEar){
            triageQuery = triageQuery.where('triage.rightEar = :rightEar', { rightEar: query.rightEar });
        }

        if(query.leftEar){
            triageQuery = triageQuery.andWhere('triage.leftEar = :leftEar', { leftEar: query.leftEar });
        }

        if(query.evaluationDate){
            triageQuery = triageQuery.andWhere('triage.evaluationDate like :evaluationDate', { evaluationDate: `%${query.evaluationDate}%` });
        }

        if(query.testType){
            triageQuery = triageQuery.andWhere('conduct.testType = :testType', { testType: query.testType });
        }

        return triageQuery.getRawMany();
    }

    public async findById(id: number): Promise<Triage | null> {
        return Triage.findOne({
            relations: [
                'baby',
                'baby.birthMother',
                'equipment',
                'orientation',
                'conduct'
            ],
            where: {
                id
            }
        });
    }
}
