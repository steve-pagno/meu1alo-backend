import AbstractRoutes  from '../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../helpers/http/AbstractRoutesTypes';
import { ValidatorObject } from '../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../helpers/validator/ValidatorRequest';
import { ValidatorString } from '../../helpers/validator/ValidatorString';
import UserController from './UserController';

export default class UserRoutes extends AbstractRoutes {
    private readonly userController: UserController;

    constructor() {
        super();
        this.userController = new UserController();

        this.login();
    }

    private login(): void {
        const config: RouteConfig = {
            description: 'Endpoint para logar um usuário',
            method: 'post',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorString('userType').lengthMin(4).required(true)
                    .withExample('secretary').withDescription('tipo de usuário'),
            ]).required(true)),
            path: '/:userType/login',
            withAuthHeader: true,
            withJWT: false
        };
        this.addRoute<{userType: string}>(config, this.userController.login);
    }
}
