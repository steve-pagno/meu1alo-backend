import AbstractRoutes from '../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../helpers/http/AbstractRoutesTypes';
import { InstitutionUser } from '../../entity/institution/InstitutionUser';
import { ValidatorNumber } from '../../helpers/validator/ValidatorNumber';
import { ValidatorObject } from '../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../helpers/validator/ValidatorRequest';
import { ValidatorString } from '../../helpers/validator/ValidatorString';
import InstitutionController from './InstitutionController';

export default class InstitutionRoutes extends AbstractRoutes {
    private institutionController = new InstitutionController();

    constructor() {
        super();

        this.create();
        this.getDashboard();
        this.getInstitutionTypes();
        this.getAll();
        this.getOne();
    }

    private create() {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todos os serviços de referencia',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [
                new ValidatorString('password').required(true).withDescription('Senha'),
                //TODO: ajustar parametros
            ]).withDescription('Instituição').required(true)),
            path: '/',
            withJWT: false
        };
        this.addRoute<InstitutionUser>(config, this.institutionController.create);
    }

    private getOne() {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar uma instituição',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id',
            withJWT: true
        };
        this.addRoute<{id: number}>(config, this.institutionController.getOne);
    }

    private getAll() {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todas as instituições',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/',
            withJWT: false
        };
        this.addRoute<never>(config, this.institutionController.getAll);
    }

    private getDashboard() {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todos os reports do dashboard de uma instituição',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/dashboard',
            withJWT: true
        };
        this.addRoute<never>(config, this.institutionController.getDashboard);
    }

    private getInstitutionTypes() {
        const config: RouteConfig = {
            description: 'Tipos de instituição',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/types',
            withJWT: false
        };
        this.addRoute<never>(config, this.institutionController.getInstitutionTypes);
    }
}
