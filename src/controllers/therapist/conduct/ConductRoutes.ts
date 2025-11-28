import AbstractRoutes from '../../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../../helpers/http/AbstractRoutesTypes';
import { ValidatorNumber } from '../../../helpers/validator/ValidatorNumber';
import { ValidatorObject } from '../../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../../helpers/validator/ValidatorRequest';
import ConductController from './ConductController';
import { ConductGetParamsInterface, ConductGetParamsInterfaceRequired, ConductJwt } from './ConductTypes';

export default class ConductRoutes extends AbstractRoutes {
    private conductController: ConductController;

    constructor() {
        super();
        this.conductController = new ConductController();

        this.create();
        this.getAll();
        this.get();
    }

    private create(): void {
        const config: RouteConfig = {
            description: 'Endpoint para criar uma conduta',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [
                //TODO: ajustar parametros
            ]).withDescription('Institution').required(true)),
            path: '/',
            withJWT: true
        };
        this.addRoute<ConductJwt>(config, this.conductController.create);
    }

    public getAll(): void {
        const config: RouteConfig = {
            description: 'Endpoint para pegar todos as condutas',
            method: 'get',
            params: new ValidatorRequest(undefined, new ValidatorObject('query', [
                new ValidatorNumber('leftEar').min(0).max(1).withExample(0).withDescription('Passou orelha esquerda'),
                new ValidatorNumber('rightEar').min(0).max(1).withExample(0).withDescription('Passou orelha direita'),
                new ValidatorNumber('irda').min(0).withExample(1).withDescription('ID do IRDA'),
                new ValidatorNumber('testType').min(1).withExample(1).withDescription('ID do tipo de teste'),
            ]).required(false)),
            path: '/',
            withJWT: true
        };
        this.addRoute<ConductGetParamsInterface>(config, this.conductController.getAll);
    }

    public get(): void {
        const config: RouteConfig = {
            description: 'Endpoint para pegar uma conduta',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('leftEar').min(0).max(1).required(true).withExample(0).withDescription('Passou orelha esquerda'),
                new ValidatorNumber('rightEar').min(0).max(1).required(true).withExample(0).withDescription('Passou orelha direita'),
                new ValidatorNumber('irda').min(0).required(true).withExample(1).withDescription('ID do IRDA'),
                new ValidatorNumber('testType').min(1).required(true).withExample(1).withDescription('ID do tipo de teste'),
            ]).required(true)),
            path: '/:leftEar/:rightEar/:irda/:testType',
            withJWT: true
        };
        this.addRoute<ConductGetParamsInterfaceRequired>(config, this.conductController.get);
    }
}
