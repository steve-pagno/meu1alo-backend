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
}