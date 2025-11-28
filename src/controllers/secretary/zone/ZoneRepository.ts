import { FindOneOptions } from 'typeorm';
import { Zone } from '../../../entity/secretaries/Zone';

export default class ZoneRepository {
    public async getAll(stateId?: number): Promise<Zone[]> {
        let zones = Zone.createQueryBuilder('z')
            .select(['z.id AS id', 'z.secretary.name AS name'])
        ;
        if(stateId){
            zones = zones.where('z.state = :state',  { state: stateId });
        }
        return zones.execute();
    }

    public async getZonesByStateId(id: number): Promise<Zone[] | undefined> {
        return Zone.createQueryBuilder('z')
            .select(['z.id AS id', 'z.secretary.name AS name'])
            .where('z.state = :state',  { state: id })
            .getRawMany()
        ;
    }

    public async getById(id: number): Promise<Zone | null> {
        return Zone.findOne({ where: { id } });
    }

    public async deleteZone(id: number): Promise<Zone> {
        const zone = new Zone();
        zone.id = Number(id);
        return zone.softRemove();
    }

    public async recoverZone(id: number): Promise<Zone> {
        const zone = await Zone.findOne({
            id: id,
            withDeleted: true,
        } as FindOneOptions);
        return zone.recover();
    }
}
