import { Equipment } from '../../../entity/equipment/Equipment';
import { NotFoundEquipmentError } from './EquipmentErrors';
import EquipmentRepository from './EquipmentRepository';
import { QueryEquipmentDTO } from './EquipmentTypes';

export default class EquipmentService{
    private equipmentRepository: EquipmentRepository;

    constructor() {
        this.equipmentRepository = new EquipmentRepository();
    }

    public async create(equipment: Equipment): Promise<Equipment> {
        return this.equipmentRepository.create(equipment);
    }

    public async deleteOne(idEquipment: number): Promise<Equipment> {
        const equipment = await this.equipmentRepository.getOne(idEquipment);
        if(!equipment) {
            throw new NotFoundEquipmentError(idEquipment.toString());
        }
        return this.equipmentRepository.deleteOne(equipment);
    }

    public async getAll(query: QueryEquipmentDTO): Promise<Equipment[] | undefined>{
        return this.equipmentRepository.getAll(query.model, query.brand, query.dateOfLastCalibration, query.listAllActives);
    }

}
