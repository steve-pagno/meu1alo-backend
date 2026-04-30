import AbstractRoutes from '../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../helpers/http/AbstractRoutesTypes';
import { JwtUserInterface } from '../../helpers/JwtAuth';
import { ValidatorRequest } from '../../helpers/validator/ValidatorRequest';
import ParentsController from './ParentsController';

export default class ParentsRoutes extends AbstractRoutes {
    private controller: ParentsController;

    constructor() {
        super();
        this.controller = new ParentsController();

        this.getDashboard();
        this.getTriages();
        this.getMe();
        this.updateMe();
        this.getByCpf();
    }

    private getDashboard(): void {
        const config: RouteConfig = {
            description: 'Dashboard da área dos pais',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/dashboard',
            withJWT: true
        };

        this.addRoute<JwtUserInterface>(config, this.controller.getDashboard);
    }

    private getTriages(): void {
        const config: RouteConfig = {
            description: 'Lista triagens do responsável logado',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/triage',
            withJWT: true
        };

        this.addRoute<JwtUserInterface>(config, this.controller.getTriages);
    }

    private getMe(): void {
        const config: RouteConfig = {
            description: 'Recuperar dados da minha conta',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/me',
            withJWT: true
        };
        this.addRoute<any>(config, this.controller.getMe);
    }

    private updateMe(): void {
        const config: RouteConfig = {
            description: 'Atualizar dados da minha conta',
            method: 'put',
            params: new ValidatorRequest(),
            path: '/me',
            withJWT: true
        };
        this.addRoute<any>(config, this.controller.updateMe);
    }

    private getByCpf(): void {
        const config: RouteConfig = {
            description: 'Recuperar dados públicos do responsável via CPF',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new (require('../../helpers/validator/ValidatorObject').ValidatorObject)('params', [
                new (require('../../helpers/validator/ValidatorString').ValidatorString)('cpf').required(true)
            ])),
            path: '/cpf/:cpf',
            withJWT: true
        };
        this.addRoute<any>(config, this.controller.getByCpf);
    }
}