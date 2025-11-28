import AbstractRoutes from '../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../helpers/http/AbstractRoutesTypes';
import { JwtUserInterface } from '../../helpers/JwtAuth';
import { ValidatorRequest } from '../../helpers/validator/ValidatorRequest';
import ReportsController from './ReportsController';

export default class ReportsRoutes extends AbstractRoutes {
    private readonly reportsController: ReportsController;

    constructor() {
        super();
        this.reportsController = new ReportsController();

        this.getBabiesPassFailInstitution();
        this.getBabiesPassFailSecretary();
        this.getBabiesPassFailTherapist();

        this.getEquipmentInstitution();
        this.getEquipmentSecretary();
        this.getEquipmentTherapist();

        this.getIndicatorsInstitution();
        this.getIndicatorsPercentInstitution();
        this.getIndicatorsPercentSecretary();

        this.getIndicatorsPercentTherapist();
        this.getIndicatorsSecretary();
        this.getIndicatorsTherapist();
    }

    private getBabiesPassFailSecretary(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório passou falhou de uma Secretaria',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/baby-pass-fail/secretary',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getBabiesPassFailSecretary);
    }
    private getBabiesPassFailInstitution(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório passou falhou de uma Institutição',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/baby-pass-fail/institution',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getBabiesPassFailInstitution);
    }
    private getBabiesPassFailTherapist(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório passou falhou de um Fonoaudiólogo',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/baby-pass-fail/therapist',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getBabiesPassFailTherapist);
    }

    // private getBabiesComeBorn(): void {
    //     const config: RouteConfig = {
    //         description: 'Endpoint para recuperar o relatório de bebes que nasceram',
    //         method: 'get',
    //         params: new ValidatorRequest(),
    //         path: '/baby-come-born/:userType',
    //         withJWT: true
    //     };
    //     this.addRoute<JwtUserInterface>(config, this.reportsController.getBabiesComeBorn);
    // };

    private getIndicatorsPercentSecretary(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório dos indicadores em porcentagem de uma Secretaria',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/indicators-percent/secretary',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getIndicatorsPercentSecretary);
    }
    private getIndicatorsPercentInstitution(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório dos indicadores em porcentagem de uma Instituição',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/indicators-percent/institution',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getIndicatorsPercentInstitution);
    }
    private getIndicatorsPercentTherapist(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório dos indicadores em porcentagem de um Fonoaudiólogo',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/indicators-percent/therapist',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getIndicatorsPercentTherapist);
    }

    private getIndicatorsSecretary(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório dos indicadores de uma Secretaria',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/indicators/secretary',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getIndicatorsSecretary);
    }
    private getIndicatorsInstitution(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório dos indicadores de uma Instituição',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/indicators/institution',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getIndicatorsInstitution);
    }
    private getIndicatorsTherapist(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório dos indicadores de um Fonoaudiólogo',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/indicators/therapist',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getIndicatorsTherapist);
    }

    private getEquipmentSecretary(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório dos equipamentos de uma Secretaria',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/equipment/secretary',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getEquipmentSecretary);
    }
    private getEquipmentInstitution(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório dos equipamentos de uma Instituição',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/equipment/institution',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getEquipmentInstitution);
    }
    private getEquipmentTherapist(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar o relatório dos equipamentos de um Fonoaudiólogo',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/equipment/therapist',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.reportsController.getEquipmentTherapist);
    }
}
