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

        this.getMe();
        this.updateMe();
        this.create();
        this.getDashboard();
        this.getInstitutionTypes();
        this.getAll();
        this.getTriages();
        this.getTherapists();
        this.checkTherapistByCrfa();
        this.addOrRegisterTherapist();
        this.removeTherapist();
        this.getOne();
    }

    private getTherapists() {
        const config: RouteConfig = {
            description: 'Recuperar fonoaudiólogos da instituição logada',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/therapist',
            withJWT: true
        };
        this.addRoute<any>(config, this.institutionController.getTherapists);
    }

    private checkTherapistByCrfa() {
        const config: RouteConfig = {
            description: 'Verificar se fonoaudiólogo já existe pelo CRFa',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorString('crfa').required(true)
            ])),
            path: '/therapist/check-crfa/:crfa',
            withJWT: true
        };
        this.addRoute<any>(config, this.institutionController.checkTherapistByCrfa);
    }

    private addOrRegisterTherapist() {
        const config: RouteConfig = {
            description: 'Cadastrar ou vincular fonoaudiólogo',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [])),
            path: '/therapist',
            withJWT: true
        };
        this.addRoute<any>(config, this.institutionController.addOrRegisterTherapist);
    }

    private removeTherapist() {
        const config: RouteConfig = {
            description: 'Remover fonoaudiólogo da instituição logada',
            method: 'delete',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('therapistId').required(true)
            ])),
            path: '/therapist/:therapistId',
            withJWT: true
        };
        this.addRoute<any>(config, this.institutionController.removeTherapist);
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
            withJWT: true
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

    private getMe() {
        const config: RouteConfig = {
            description: 'Recuperar dados da minha instituição',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/me',
            withJWT: true
        };
        this.addRoute<any>(config, this.institutionController.getMe);
    }

    private updateMe() {
        const config: RouteConfig = {
            description: 'Atualizar dados da minha instituição',
            method: 'put',
            params: new ValidatorRequest(new ValidatorObject('body', [])), // body livre por enquanto
            path: '/me',
            withJWT: true
        };
        this.addRoute<any>(config, this.institutionController.updateMe);
    }

    private getTriages() {
        const config: RouteConfig = {
            description: 'Recuperar triagens da instituição logada',
            method: 'get',
            params: new ValidatorRequest(undefined, new ValidatorObject('query', []).withDescription('Query params').required(false)),
            path: '/triage',
            withJWT: true
        };
        this.addRoute<any>(config, this.institutionController.getTriages);
    }
}