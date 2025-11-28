import AbstractRoutes from '../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../helpers/http/AbstractRoutesTypes';
import { ValidatorRequest } from '../../helpers/validator/ValidatorRequest';
import BabyController from './BabyController';

export default class BabyRoutes extends AbstractRoutes {
    private babyController: BabyController;

    constructor() {
        super();
        this.babyController = new BabyController();

        this.listChildBirthTypes();
        this.getAllBabies();
    }

    private listChildBirthTypes() {
        const config: RouteConfig = {
            description: 'Tipo de parto',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/birth-types',
            withJWT: false
        };
        this.addRoute<never>(config, this.babyController.listChildBirthTypes);
    }

    private getAllBabies() {
        const config: RouteConfig = {
            description: 'Endpoint para pegar todos os bebês',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/',
            withJWT: true
        };
        this.addRoute<never>(config, this.babyController.getAllBabies);
    }
}
