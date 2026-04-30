import { HttpStatus } from '../../helpers/http/AbstractHttpErrors';
import SecretaryService from './SecretaryService';

export default class SecretaryController {
    public async getDashboard() {
        const secretaryService = new SecretaryService();

        const result = await secretaryService.getDashboard();
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getIsState(params: { id: number }) {
        const secretaryService = new SecretaryService();

        const result = await secretaryService.getIsState(params.id);
        return { httpStatus: HttpStatus.OK, result };
    }

    // Método para buscar os dados para a tela de edição
    public async get(params: { id: number }) {
        const secretaryService = new SecretaryService();
        const result = await secretaryService.getById(params.id);

        return { httpStatus: HttpStatus.OK, result };
    }

    // Método para atualizar os dados (RF5)
    public async update(params: any) {
        const secretaryService = new SecretaryService();

        // O "params" aqui vem com o ID da URL misturado com os dados do formulário
        const { id, ...dadosParaAtualizar } = params;

        const result = await secretaryService.update(id, dadosParaAtualizar);
        return { httpStatus: HttpStatus.OK, result };
    }

    // Método para criar uma nova secretaria municipal (RF4)
    public async create(params: any) {
        const secretaryService = new SecretaryService();

        // No create, não tem ID na URL, então o params é exatamente os dados do formulário
        const result = await secretaryService.create(params);
        return { httpStatus: HttpStatus.CREATED, result };
    }

    public async getMe(params: any) {
        const secretaryService = new SecretaryService();
        const secretaryId = params.jwtObject ? params.jwtObject.id : params.id || params.user?.jwtObject?.id;
        const result = await secretaryService.getById(secretaryId);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async updateMe(params: any) {
        const secretaryService = new SecretaryService();
        const secretaryId = params.jwtObject ? params.jwtObject.id : params.id || params.user?.jwtObject?.id;

        if (!params.password) {
            delete params.password;
            delete params.passwordConfirm;
        }

        const result = await secretaryService.update(secretaryId, params);
        return { httpStatus: HttpStatus.OK, result };
    }
}