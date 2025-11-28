import AbstractRoutes from '../../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../../helpers/http/AbstractRoutesTypes';
import { ValidatorNumber } from '../../../helpers/validator/ValidatorNumber';
import { ValidatorObject } from '../../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../../helpers/validator/ValidatorRequest';
import CityController from './CityController';

export default class CityRoutes extends AbstractRoutes {
    private cityController: CityController;

    constructor() {
        super();
        this.cityController = new CityController();

        this.getAll();
        this.getById();
        this.updateCityZone();
    }

    private getAll(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todas as cidades de estado',
            method: 'get',
            params: new ValidatorRequest(undefined, new ValidatorObject('query', [
                new ValidatorNumber('state').min(1).required(false).withExample(1).withDescription('ID do estado')
            ])),
            path: '/',
            withJWT: false
        };
        this.addRoute<{state?: number}>(config, this.cityController.getAll);
    }

    private getById(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar uma cidade pelo id',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id',
            withJWT: false
        };
        this.addRoute<{id: number}>(config, this.cityController.getById);
    }

    private updateCityZone(): void {
        const config: RouteConfig = {
            description: 'Endpoint para setar uma zona em uma cidade',
            method: 'patch',
            params: new ValidatorRequest(
                new ValidatorObject('body', [
                    new ValidatorObject('zone', [
                        new ValidatorNumber('id').min(1).required(true).withExample(1)
                    ]).required(true)
                ]).required(true),
                undefined,
                new ValidatorObject('params', [
                    new ValidatorNumber('id').min(1).required(true).withExample(1)
                ])
            ),
            path: '/:id',
            withJWT: true
        };
        this.addRoute<{id: number, zone: {id: number}}>(config, this.cityController.updateCityZone);
    }
}
