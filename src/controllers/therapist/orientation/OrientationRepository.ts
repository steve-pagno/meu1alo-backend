import { Orientation } from '../../../entity/orientation/Orientation';

export default class OrientationRepository {
    public async create(orientation: Orientation) {
        return Orientation.save(orientation);
    }

    public async deleteOne(orientation: Orientation): Promise<Orientation> {
        orientation.dateOfDeactivation = new Date();
        return orientation.save();
    }

    public async getOne(idOrientation: number): Promise<Orientation | null> {
        return Orientation.findOne({ where: { id: idOrientation } });
    }

    public async getAll(therapistID: number, description?: string, listAllActives?: boolean): Promise<Orientation[] | undefined>{
        const query = Orientation.createQueryBuilder('orientation')
            .select(
                ['orientation.id AS id',
                    'orientation.description AS description',
                    'orientation.dateOfDeactivation AS dateOfDeactivation',
                    'orientation.therapist AS therapist'
                ])
            .where('(orientation.therapist = :therapistID OR orientation.therapist is null)', { therapistID })
            .orderBy('orientation.description', 'ASC');

        if(description){
            query.andWhere('orientation.description like :description', { description: `%${description}%` });
        }

        if(listAllActives){
            query.andWhere('orientation.dateOfDeactivation IS NULL');
        }


        return query.getRawMany();
    }
}
