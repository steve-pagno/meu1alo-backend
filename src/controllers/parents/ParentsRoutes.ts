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
}