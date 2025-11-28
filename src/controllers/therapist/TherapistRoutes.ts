import AbstractRoutes from '../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../helpers/http/AbstractRoutesTypes';
import { Therapist } from '../../entity/therapist/Therapist';
import { JwtUserInterface } from '../../helpers/JwtAuth';
import { ValidatorNumber } from '../../helpers/validator/ValidatorNumber';
import { ValidatorObject } from '../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../helpers/validator/ValidatorRequest';
import ConductRoutes from './conduct/ConductRoutes';
import EquipmentRoutes from './equipment/EquipmentRoutes';
import IndicatorRoutes from './indicator/IndicatorRoutes';
import OrientationRoutes from './orientation/OrientationRoutes';
import TherapistController from './TherapistController';
import TriageRoutes from './triage/TriageRoutes';

export default class TherapistRoutes extends AbstractRoutes {
    private therapistController: TherapistController;

    constructor() {
        super();
        this.therapistController = new TherapistController();

        this.addSubRoute('/conduct', 'Conduct', new ConductRoutes());
        this.addSubRoute('/equipment', 'Equipment', new EquipmentRoutes());
        this.addSubRoute('/indicator', 'Indicator', new IndicatorRoutes());
        this.addSubRoute('/orientation', 'Orientation', new OrientationRoutes());
        this.addSubRoute('/triage', 'Triage', new TriageRoutes());

        this.create();
        this.getDashboard();
        this.getXpTypes();
        this.getEditableFields();
    }

    private create(): void {
        const config: RouteConfig = {
            description: 'Endpoint para salvar um fono',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [
                //TODO: ajustar parametros
            ]).withDescription('Institution').required(true)),
            path: '/',
            withJWT: false
        };
        this.addRoute<Therapist>(config, this.therapistController.create);
    }

    private getDashboard(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todos os relatórios de um painel de um Fono',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/dashboard',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.therapistController.getDashboard);
    }

    private getEditableFields(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todos os campos que podem ser editados de um Fono',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id',
            withJWT: true
        };
        this.addRoute<{id: number}>(config, this.therapistController.getEditableFields);
    }

    private getXpTypes(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o enum de experiencia',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/xp-types',
            withJWT: false
        };
        this.addRoute<never>(config, this.therapistController.getXpTypes);
    }
}
