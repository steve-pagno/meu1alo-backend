import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import { Orientation } from '../../../entity/orientation/Orientation';
import { Therapist } from '../../../entity/therapist/Therapist';
import OrientationService from './OrientationService';
import { OrientationJwt, QueryOrientationDTO } from './OrientationTypes';

export default class OrientationController {
    public async create(params: OrientationJwt) {
        const orientationService = new OrientationService();

        const orientation = params as Orientation;
        orientation.therapist = { id: params.jwtObject.id } as Therapist;
        const result = await orientationService.create(orientation);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getAll(params: QueryOrientationDTO) {
        const orientationService = new OrientationService();

        const result = await orientationService.getAll(params.jwtObject.id, params.description, params.listAllActives);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async deleteOne(params: {id: number}) {
        const orientationService = new OrientationService();

        const result = await orientationService.deleteOne(params.id);

        return { httpStatus: HttpStatus.OK, result };
    }

}
