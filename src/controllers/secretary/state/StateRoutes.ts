import AbstractRoutes from '../../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../../helpers/http/AbstractRoutesTypes';
import { ValidatorNumber } from '../../../helpers/validator/ValidatorNumber';
import { ValidatorObject } from '../../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../../helpers/validator/ValidatorRequest';
import StateController from './StateController';

export default class StateRoutes extends AbstractRoutes {
    private stateController: StateController;
    constructor() {
        super();
        this.stateController = new StateController();

        this.getAll();
        this.getById();
    }

    private getAll(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todas as secretarias de estado',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/',
            withJWT: false
        };
        this.addRoute<never>(config, this.stateController.getAll);
    }

    private getById(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar uma secretaria do estado pelo id',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id',
            withJWT: false
        };
        this.addRoute<{id: number}>(config, this.stateController.getById);
    }
}
