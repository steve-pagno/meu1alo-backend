import { Zone } from '../../../entity/secretaries/Zone';
import ZoneRepository from './ZoneRepository';

export default class ZoneService {
    private zoneRepository: ZoneRepository;

    constructor() {
        this.zoneRepository = new ZoneRepository();
    }

    public async getAll(stateId?: number) {
        return this.zoneRepository.getAll(stateId);
    }

    public async getZonesByStateId(id: number) {
        return this.zoneRepository.getZonesByStateId(id);
    }

    public async getById(id: number) {
        const zone = await this.zoneRepository.getById(id);
        if (!zone) {
            //TODO: throws NOT_FOUND 'ID não encontrado'
        }
        return zone;
    }

    public async deleteZone(id: number) {
        const zone: Zone = await this.zoneRepository.deleteZone(id);
        return { disabled: zone.disableDate };
    }

    public async recoverZone(id: number) {
        const zone = await this.zoneRepository.recoverZone(id);
        return { recovered: zone };
    }
}
