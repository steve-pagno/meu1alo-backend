import { HttpStatus } from '../../helpers/http/AbstractHttpErrors';
import { JwtUserInterface } from '../../helpers/JwtAuth';
import ParentsService from './ParentsService';

export default class ParentsController {
    public async getDashboard() {
        const service = new ParentsService();
        const result = await service.getDashboard();
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getTriages(params: JwtUserInterface) {
        const service = new ParentsService();

        const guardianId = Number(params.jwtObject.id);
        console.log('ID do responsável logado:', guardianId);

        const result = await service.getTriagesByGuardianId(guardianId);
        console.log('Triagens retornadas para o responsável:', result);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getMe(params: any) {
        const service = new ParentsService();
        const guardianId = params.jwtObject ? params.jwtObject.id : params.id || params.user?.jwtObject?.id;
        const result = await service.getById(guardianId);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async updateMe(params: any) {
        const service = new ParentsService();
        const guardianId = params.jwtObject ? params.jwtObject.id : params.id || params.user?.jwtObject?.id;

        if (!params.password) {
            delete params.password;
            delete params.passwordConfirm;
        }

        delete params.jwtObject;

        const result = await service.update(guardianId, params);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getByCpf(params: any) {
        const guardianService = new (require('../guardian/GuardianService').default)();
        const result = await guardianService.getPublicByCpf(params.cpf);
        return { httpStatus: HttpStatus.OK, result };
    }
}