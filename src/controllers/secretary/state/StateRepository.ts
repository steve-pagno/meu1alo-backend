import { State } from '../../../entity/secretaries/State';

export default class StateRepository {
    public async getAll() {
        return State.createQueryBuilder('s')
            .select(['s.id AS id', 's.name AS name'])
            .execute()
        ;
    }

    public async getById(id: number) {
        return State.findOne({ where: { id } });
    }
}
