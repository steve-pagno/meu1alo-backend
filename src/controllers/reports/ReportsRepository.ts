import { Equipment } from '../../entity/equipment/Equipment';
import { Indicator } from '../../entity/indicator/Indicator';
import { Institution } from '../../entity/institution/Institution';
import { InstitutionUser } from '../../entity/institution/InstitutionUser';
import { State } from '../../entity/secretaries/State';
import { SecretaryUser } from '../../entity/secretaries/user/SecretaryUser';
import { Zone } from '../../entity/secretaries/Zone';
import { Therapist } from '../../entity/therapist/Therapist';
import { Triage } from '../../entity/triage/Triage';

export default class ReportsRepository {
    public async getInstitutionsIDsOfTherapist(therapistId: number): Promise<number[]> {
        const result = await Therapist
            .createQueryBuilder('t')
            .select(['i.id AS id'])
            .leftJoin('t.institutions', 'i')
            .where('t.id = :therapistId', { therapistId })
            .getRawMany()
        ;
        return result.map(r => r.id);
    }

    public async getInstitutionsIDsOfInstitutionUser(userId: number): Promise<number> {
        const result = await InstitutionUser
            .createQueryBuilder('iu')
            .select(['i.id AS id'])
            .leftJoin('iu.institution', 'i')
            .where('iu.id = :userId', { userId })
            .getRawOne()
        ;
        return result.id;
    }

    public async getInstitutionsIDsOfSecretary(userId: number): Promise<number[]> {
        const secretary = await SecretaryUser.createQueryBuilder('su')
            .select(['su.state AS state', 'su.zone AS zone'])
            .leftJoin('su.state', 's')
            .leftJoin('su.zone', 'z')
            .where('su.id = :userId', { userId })
            .getRawOne()
        ;
        let result: { id: number }[];
        if(secretary.zone) {
            result = await Zone.createQueryBuilder('z')
                .select('c.id as id')
                .leftJoin('z.cities', 'c')
                .where('z.id = :id', { id: secretary.zone })
                .getRawMany()
            ;
        } else {
            result = await State.createQueryBuilder('s')
                .select('c.id as id')
                .leftJoin('s.cities', 'c')
                .where('s.id = :id', { id: secretary.state })
                .getRawMany()
            ;
        }
        const cities = result.map(item => item.id);
        const institutions = await Institution
            .createQueryBuilder('i')
            .select(['i.id as id'])
            .where('i.city IN (:cities)', { cities })
            .getRawMany()
        ;
        return institutions.map(i => i.id);
    }

    public async passBabiesByInstitutions(institutionsIDs: number[]): Promise<number> {
        return Triage
            .createQueryBuilder('t')
            .where('t.institution IN (:institutionsIDs)', { institutionsIDs })
            .andWhere('t.leftEar = 1')
            .andWhere('t.rightEar = 1')
            .getCount()
        ;
    }
    public async failBabiesByInstitutions(institutionsIDs: number[]): Promise<number> {
        return Triage
            .createQueryBuilder('t')
            .where('t.institution IN (:institutionsIDs)', { institutionsIDs })
            .andWhere('(t.leftEar = 0 OR t.rightEar = 0)')
            .getCount()
        ;
    }

    public async getIndicatorsPercentByInstitutions(institutionsIDs: number[]): Promise<{name: string, total: number}[]> {
        return Indicator
            .createQueryBuilder('i')
            .select(['COUNT(t.id) AS total', 'i.name AS name'])
            .leftJoin('i.triages', 't')
            .where('t.institution IN (:institutionsIDs)', { institutionsIDs })
            .orderBy('total', 'DESC')
            .limit(20)
            .groupBy('i.name')
            .getRawMany()
        ;
    }
    public async getTriagesTotal(institutionsIDs: number[]): Promise<number> {
        return Triage
            .createQueryBuilder('t')
            .where('t.institution IN (:institutionsIDs)', { institutionsIDs })
            .getCount()
        ;
    }

    public async getIndicatorsByInstitutions(institutionsIDs: number[]): Promise<{zero: number, one: number, multiple: number} | undefined> {
        const baseSubQuery = 'SELECT COUNT(`i`.`id_indicador_risco`) FROM `triagem_indicador` `t_i` LEFT JOIN `indicador_risco` `i` ON `i`.`id_indicador_risco` = `t_i`.`fk_indicador` ' +
            'WHERE `t_i`.`fk_triagem` = t1.id_triagem'
        ;
        return Triage
            .createQueryBuilder('t1')
            .select([
                `COUNT(IF((${baseSubQuery}) = 0, 1, NULL)) AS zero`,
                `COUNT(IF((${baseSubQuery}) = 1, 1, NULL)) AS one`,
                `COUNT(IF((${baseSubQuery}) > 1, 1, NULL)) AS multiple`
            ])
            .where('t1.institution IN (:institutionsIDs)', { institutionsIDs })
            .getRawOne()
        ;
    }

    public async getEquipmentByInstitutions(institutionsIDs: number[]): Promise<{model: string, total: number}[]> {
        return Equipment
            .createQueryBuilder('e')
            .select(['COUNT(t.id) AS total', 'e.model AS model'])
            .leftJoin('e.triages', 't')
            .where('t.institution IN (:institutionsIDs)', { institutionsIDs })
            .andWhere('(t.leftEar = 0 OR t.rightEar = 0)')
            .orderBy('total', 'DESC')
            .limit(20)
            .groupBy('e.model')
            .getRawMany()
        ;
    }
}
