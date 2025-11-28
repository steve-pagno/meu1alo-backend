import AbstractRoutes from '../../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../../helpers/http/AbstractRoutesTypes';
import { ValidatorObject } from '../../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../../helpers/validator/ValidatorRequest';
import TriageReportsRoutes from './reports/TriageReportsRoutes';
import TriageController from './TriageController';
import { QueryTriageDTO, TriageJwt } from './TriageTypes';

export default class TriageRoutes extends AbstractRoutes {
    private triageController: TriageController;

    constructor() {
        super();
        this.triageController = new TriageController();

        this.create();
        this.getAll();
        this.triageTypes();

        this.addSubRoute('/reports', 'Reports', new TriageReportsRoutes());
    }

    private create(): void {
        const config: RouteConfig = {
            description: 'Endpoint para criar uma consulta/triagem',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [
                //TODO: ajustar parametros
            ]).withDescription('Triage').required(true)),
            path: '/',
            withJWT: true
        };
        this.addRoute<TriageJwt>(config, this.triageController.create);
    }

    private getAll(): void {
        const config: RouteConfig = {
            description: 'Endpoint para pegar todas as triagens',
            method: 'get',
            params: new ValidatorRequest(undefined, new ValidatorObject('query', [
                //TODO: ajustar parametros
            ]).withDescription('Triage').required(false)),
            path: '/',
            withJWT: true
        };
        this.addRoute<QueryTriageDTO>(config, this.triageController.getAll);
    }

    private triageTypes(): void {
        const config: RouteConfig = {
            description: 'Tipos de triagem',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/types',
            withJWT: false
        };
        this.addRoute<never>(config, this.triageController.triageTypes);
    }
}
