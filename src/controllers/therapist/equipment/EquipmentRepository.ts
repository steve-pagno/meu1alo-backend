import { Equipment } from '../../../entity/equipment/Equipment';

export default class EquipmentRepository {
    public async create(equipment: Equipment): Promise<Equipment> {
        return Equipment.save(equipment);
    }

    public async deleteOne(equipment: Equipment): Promise<Equipment> {
        equipment.dateOfDeactivation = new Date();
        return equipment.save();
    }

    public async getOne(idEquipment: number): Promise<Equipment | null> {
        return Equipment.findOne({ where: { id: idEquipment } });
    }

    public getAll(model?: string, brand?: string, dateOfLastCalibration?: string, listAllActives?: boolean): Promise<Equipment[] | undefined>{
        const query = Equipment.createQueryBuilder('equipment')
            .select([
                'equipment.id AS id',
                'equipment.model AS name',
                'equipment.model AS model',
                'equipment.brand AS brand',
                'equipment.dateOfLastCalibration AS dateOfLastCalibration',
                'equipment.dateOfDeactivation AS dateOfDeactivation'
            ]).orderBy('name','ASC');

        if(model){
            query.andWhere('equipment.model like :model', { model: `%${model}%` });
        }

        if(brand){
            query.andWhere('equipment.brand like :brand', { brand: `%${brand}%` });
        }

        if(dateOfLastCalibration){
            query.andWhere('equipment.dateOfLastCalibration like :date', { date: `%${dateOfLastCalibration}%` });
        }

        if(listAllActives){
            query.andWhere('equipment.dateOfDeactivation IS NULL');
        }

        return query.getRawMany();
    }
}
