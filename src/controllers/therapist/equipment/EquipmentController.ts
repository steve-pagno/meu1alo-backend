import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import { Equipment } from '../../../entity/equipment/Equipment';
import { Therapist } from '../../../entity/therapist/Therapist';
import EquipmentService from './EquipmentService';
import { EquipmentJwt, QueryEquipmentDTO } from './EquipmentTypes';

export default class EquipmentController {
    public async create(params: EquipmentJwt) {
        const equipmentService = new EquipmentService();

        const equipment = params as Equipment;
        equipment.therapist = { id: params.jwtObject.id } as Therapist;

        const result = await equipmentService.create(equipment);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async update(params: EquipmentJwt) {
        const equipmentService = new EquipmentService();

        const equipment = params as Equipment;
        equipment.therapist = { id: params.jwtObject.id } as Therapist;

        const result = await equipmentService.update(Number((params as any).id), equipment);

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
