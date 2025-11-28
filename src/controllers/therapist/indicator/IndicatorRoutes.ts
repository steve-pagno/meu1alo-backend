import AbstractRoutes from '../../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../../helpers/http/AbstractRoutesTypes';
import { ValidatorObject } from '../../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../../helpers/validator/ValidatorRequest';
import { ValidatorString } from '../../../helpers/validator/ValidatorString';
import IndicatorController from './IndicatorController';
import { IndicatorJwt, QueryIndicatorJwt } from './IndicatorTypes';

export default class IndicatorRoutes extends AbstractRoutes {
    private indicatorController: IndicatorController;

    constructor() {
        super();

        this.indicatorController = new IndicatorController();

        this.create();
        this.getAll();
    }

    private create(): void {
        const config: RouteConfig = {
            description: 'Endpoint para criar uma indicador de risco',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [
                //TODO: ajustar parametros
            ]).withDescription('Indicator').required(true)),
            path: '/',
            withJWT: true
        };
        this.addRoute<IndicatorJwt>(config, this.indicatorController.create);
    }

    public getAll(): void {
        const config: RouteConfig = {
            description: 'Endpoint para pegar todos os indicadores',
            method: 'get',
            params: new ValidatorRequest(undefined, new ValidatorObject('query', [
                new ValidatorString('name').required(false).withExample('indicador1').withDescription('nome')
            ]).required(false)),
            path: '/',
            withJWT: true
        };
        this.addRoute<QueryIndicatorJwt>(config, this.indicatorController.getAll);
    }
}
