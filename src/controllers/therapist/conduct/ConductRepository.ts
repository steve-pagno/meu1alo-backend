import { Conduct } from '../../../entity/conduct/Conduct';

export default class ConductRepository {

    public getAll(leftEar?: number, rightEar?: number, irda?: number, testType?: number): Promise<Conduct[] | undefined>{
        const query = Conduct.createQueryBuilder('conduct')
            .select([
                'conduct.id AS id',
                'CONCAT(conduct.resultDescription, conduct.accompanyDescription) AS name',
                'conduct.resultDescription AS resultDescription',
                'conduct.accompanyDescription AS accompanyDescription',
                'conduct.leftEar AS leftEar',
                'conduct.rightEar AS rightEar',
                'conduct.irda AS irda',
                'conduct.testType AS testType'
            ])
            .where('conduct.therapist is null');

        if(rightEar){
            query.andWhere('conduct.rightEar = :rightEar', { rightEar });
        }

        if(leftEar){
            query.andWhere('conduct.leftEar = :leftEar', { leftEar });
        }

        if(irda){
            query.andWhere('conduct.irda = :irda', { irda });
        }

        if(testType){
            query.andWhere('conduct.testType = :testType', { testType });
        }

        return query.getRawMany();
    }

    public get(leftEar: number, rightEar: number, irda: number, testType: number): Promise<Conduct | undefined>{
        const query = Conduct.createQueryBuilder('conduct')
            .select([
                'conduct.id AS id',
                'CONCAT(conduct.resultDescription, conduct.accompanyDescription) AS name',
            ])
            .where('conduct.leftEar = :leftEar', { leftEar: leftEar })
            .andWhere('conduct.rightEar = :rightEar', { rightEar: rightEar })
            .andWhere('conduct.irda = :irda', { irda: irda })
            .andWhere('conduct.testType = :testType', { testType: testType });
        return query.getRawOne();
    }

    public save(conduct: Conduct): Promise<Conduct>{
        return Conduct.save(conduct);
    }
}
