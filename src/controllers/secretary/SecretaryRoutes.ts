import AbstractRoutes from '../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../helpers/http/AbstractRoutesTypes';
import { JwtUserInterface } from '../../helpers/JwtAuth';
import { ValidatorNumber } from '../../helpers/validator/ValidatorNumber';
import { ValidatorObject } from '../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../helpers/validator/ValidatorRequest';
import CityRoutes from './city/CityRoutes';
import SecretaryController from './SecretaryController';
import StateRoutes from './state/StateRoutes';
import ZoneRoutes from './zone/ZoneRoutes';

export default class SecretaryRoutes extends AbstractRoutes {
    private secretaryController: SecretaryController;

    constructor() {
        super();
        this.secretaryController = new SecretaryController();

        this.addSubRoute('/city', 'City', new CityRoutes());
        this.addSubRoute('/state', 'State', new StateRoutes());
        this.addSubRoute('/zone', 'Zone', new ZoneRoutes());

        this.getDashboard();
        this.getIsState();
    }

    private getDashboard(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todos os reports do dashboard de uma secretaria',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/dashboard',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.secretaryController.getDashboard);
    }

    private getIsState(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todos os reports do dashboard de uma secretaria',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id/is-state',
            withJWT: true
        };
        this.addRoute<{id: number}>(config, this.secretaryController.getIsState);
    }
}
