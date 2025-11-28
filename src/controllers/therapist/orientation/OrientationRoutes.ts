import AbstractRoutes from '../../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../../helpers/http/AbstractRoutesTypes';
import { ValidatorBoolean } from '../../../helpers/validator/ValidatorBoolean';
import { ValidatorNumber } from '../../../helpers/validator/ValidatorNumber';
import { ValidatorObject } from '../../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../../helpers/validator/ValidatorRequest';
import { ValidatorString } from '../../../helpers/validator/ValidatorString';
import OrientationController from './OrientationController';
import { OrientationJwt, QueryOrientationDTO } from './OrientationTypes';

export default class OrientationRoutes extends AbstractRoutes {
    private orientationController: OrientationController;

    constructor() {
        super();
        this.orientationController = new OrientationController();

        this.create();
        this.deleteOne();
        this.getAll();
    }


    private create(): void {
        const config: RouteConfig = {
            description: 'Endpoint para criar uma orientação',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [
                //TODO: ajustar parametros
            ]).withDescription('Orientation').required(true)),
            path: '/',
            withJWT: true
        };
        this.addRoute<OrientationJwt>(config, this.orientationController.create);
    }

    public getAll(): void {
        const config: RouteConfig = {
            description: 'Endpoint para pegar todos as orientações',
            method: 'get',
            params: new ValidatorRequest(undefined, new ValidatorObject('query', [
                new ValidatorBoolean('listAllActives').withDescription('listar todos os ativos').required(false),
                new ValidatorString('description').withDescription('Descrição').required(false),
            ]).withDescription('Orientation').required(false)),
            path: '/',
            withJWT: true
        };
        this.addRoute<QueryOrientationDTO>(config, this.orientationController.getAll);
    }

    private deleteOne(): void {
        const config: RouteConfig = {
            description: 'Endpoint para deletar um orientação',
            method: 'delete',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id',
            withJWT: true
        };
        this.addRoute<{id: number}>(config, this.orientationController.deleteOne);
    }
}
