import { Baby } from '../../entity/baby/Baby';
import {EntityManager} from "typeorm/entity-manager/EntityManager";

export default class BabyRepository {
    public async save(baby: Baby, transaction?: EntityManager): Promise<Baby> {
        if(transaction) {
            return transaction.getRepository(Baby).save(baby);
        }
        return Baby.save(baby);
    }

    public async getAllBabies(): Promise<Baby[]> {
        return Baby.createQueryBuilder('baby')
            .select(['baby.id AS id', 'baby.name AS name', 'baby.weight AS weight',
                'baby.height AS height', 'baby.circumference AS circumference',
                'baby.birthDate AS birthDate', 'baby.gestationalAge AS gestationalAge',
                'baby.childBirthType AS childBirthType', 'baby.birthMother AS birthMother'])
            // .where('baby.therapist = :id', { id: req.body.jwtObject.id })
            // .orWhere('baby.therapist is null')
            .getRawMany()
        ;
    }
}
