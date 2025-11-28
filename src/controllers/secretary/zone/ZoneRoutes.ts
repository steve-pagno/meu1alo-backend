import AbstractRoutes from '../../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../../helpers/http/AbstractRoutesTypes';
import { SecretaryUser } from '../../../entity/secretaries/user/SecretaryUser';
import { JwtUserInterface } from '../../../helpers/JwtAuth';
import { ValidatorNumber } from '../../../helpers/validator/ValidatorNumber';
import { ValidatorObject } from '../../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../../helpers/validator/ValidatorRequest';
import ZoneController from './ZoneController';

export default class ZoneRoutes extends AbstractRoutes {
    private zoneController: ZoneController;

    constructor() {
        super();
        this.zoneController = new ZoneController();

        this.createZoneUser();
        this.deleteZone();
        this.recoverZone();
        this.getAll();
        this.getAllWithCities();
        this.getById();
    }

    private getAll(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todas as secretarias regionais',
            method: 'get',
            params: new ValidatorRequest(undefined, new ValidatorObject('query', [
                new ValidatorNumber('stateId').min(1).required(false).withExample(1)
            ]).required(false)),
            path: '/',
            withJWT: false
        };
        this.addRoute<{stateId?: number}>(config, this.zoneController.getAll);
    }

    private getAllWithCities(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todas as secretarias regionais',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/with-cities',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.zoneController.getAllWithCities);
    }

    private getById(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar uma secretaria regional pelo id',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id',
            withJWT: true
        };
        this.addRoute<{id: number}>(config, this.zoneController.getById);
    }

    private createZoneUser(): void {
        const config: RouteConfig = {
            description: 'Endpoint para criar uma região',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [
                //TODO: ajustar parametros
            ]).withDescription('Zone').required(true)),
            path: '/user',
            withJWT: false
        };
        this.addRoute<SecretaryUser>(config, this.zoneController.createZoneUser);
    }

    private deleteZone(): void {
        const config: RouteConfig = {
            description: 'Endpoint para Deletar uma região',
            method: 'delete',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id',
            withJWT: true
        };
        this.addRoute<{id: number}>(config, this.zoneController.deleteZone);
    }

    private recoverZone(): void {
        const config: RouteConfig = {
            description: 'Endpoint para Reativar uma região',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/recover/:id',
            withJWT: false
        };
        this.addRoute<{id: number}>(config, this.zoneController.recoverZone);
    }
}
