import { HttpStatus } from '../../helpers/http/AbstractHttpErrors';
import { JwtUserInterface } from '../../helpers/JwtAuth';
import ReportsService from './ReportsService';

export default class ReportsController {
    public async getBabiesPassFailSecretary(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getBabiesPassFailSecretary(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }
    public async getBabiesPassFailInstitution(params: any) {
        const reportsService = new ReportsService();

        const result = await reportsService.getBabiesPassFailInstitution(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }
    public async getBabiesPassFailTherapist(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getBabiesPassFailTherapist(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }

    // public async getBabiesComeBorn(params: JwtUserInterface) {
    //     const reportsService = new ReportsService();
    //
    //     const result = await reportsService.getBabiesComeBorn(params.jwtObject.id);
    //     return { httpStatus: HttpStatus.OK, result };
    // }

    public async getIndicatorsPercentSecretary(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getIndicatorsPercentSecretary(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }
    public async getIndicatorsPercentInstitution(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getIndicatorsPercentInstitution(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }
    public async getIndicatorsPercentTherapist(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getIndicatorsPercentTherapist(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getIndicatorsSecretary(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getIndicatorsSecretary(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }
    public async getIndicatorsInstitution(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getIndicatorsInstitution(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }
    public async getIndicatorsTherapist(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getIndicatorsTherapist(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getEquipmentSecretary(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getEquipmentSecretary(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }
    public async getEquipmentInstitution(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getEquipmentInstitution(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }
    public async getEquipmentTherapist(params: JwtUserInterface) {
        const reportsService = new ReportsService();

        const result = await reportsService.getEquipmentTherapist(params.jwtObject.id);
        return { httpStatus: HttpStatus.OK, result };
    }
}
