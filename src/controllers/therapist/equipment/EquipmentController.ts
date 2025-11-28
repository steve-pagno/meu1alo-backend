import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import { Equipment } from '../../../entity/equipment/Equipment';
import EquipmentService from './EquipmentService';
import { QueryEquipmentDTO } from './EquipmentTypes';

export default class EquipmentController {
    public async create(equipment: Equipment) {
        const equipmentService = new EquipmentService();

        const result = await equipmentService.create(equipment);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getAll(params: QueryEquipmentDTO) {
        const equipmentService = new EquipmentService();

        const result = await equipmentService.getAll(params);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async deleteOne(params: {id: number}) {
        const equipmentService = new EquipmentService();

        const result = await equipmentService.deleteOne(params.id);

        return { httpStatus: HttpStatus.OK, result };
    }
}
