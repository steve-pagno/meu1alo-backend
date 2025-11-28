import AbstractRoutes from '../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../helpers/http/AbstractRoutesTypes';
import { ReferralService } from '../../entity/referral_service/ReferralService';
import { ValidatorObject } from '../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../helpers/validator/ValidatorRequest';
import ReferralServiceController from './ReferralServiceController';

export default class ReferralServiceRoutes extends AbstractRoutes {
    private readonly referralServiceController: ReferralServiceController;

    constructor() {
        super();
        this.referralServiceController = new ReferralServiceController();

        this.create();
        this.listType();
    }

    private create() {
        const config: RouteConfig = {
            description: 'Endpoint para adicionar um serviço de referencia',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [
                //TODO: colocar os fields
            ]).required(true)),
            path: '/',
            withJWT: true
        };
        this.addRoute<ReferralService>(config, this.referralServiceController.create);
    }

    private listType() {
        const config: RouteConfig = {
            description: 'Tipos de serviço de referencia',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/types',
            withJWT: true
        };
        this.addRoute<never>(config, this.referralServiceController.listType);
    }
}
