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
        this.recoverPassword();
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

    private recoverPassword(): void {
        const config: RouteConfig = {
            description: 'Recuperar Senha',
            method: 'post',
            path: '/recover-password',
            withAuthHeader: false,
            withJWT: false,
            params: new ValidatorRequest(
                new ValidatorObject('body', [
                    new ValidatorString('email').required(true),
                    new ValidatorString('userType').required(true)
                ]).required(true),
                
                undefined, 

                undefined
            )
        };

        this.addRoute<{email: string, userType: string}>(
            config, 
            this.userController.recoverPassword.bind(this.userController)
        );
    }
}
