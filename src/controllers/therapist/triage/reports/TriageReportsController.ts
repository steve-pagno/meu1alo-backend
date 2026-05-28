import { HttpStatus } from '../../../../helpers/http/AbstractHttpErrors';
import { ResponseHttpController } from '../../../../helpers/http/AbstractRoutesTypes';
import HtmlToPdfBuffer from '../../../../helpers/HtmlToPdfBuffer';
import TriageService from '../TriageService';
import HistoricSerieReportsDTO from './dto/HistoricSerieReportsDTO';
import OrientationsReportsDTO from './dto/OrientationsReportsDTO';
import TestReportsDTO from './dto/TestReportsDTO';

const htmlToPdf = new HtmlToPdfBuffer();

export default class TriageReportsController {
    public async fileHistoricSerie(params: any): Promise<ResponseHttpController> {
        const service = new TriageService();
        const therapistId = params.jwtObject?.userType === 'therapist' ? params.jwtObject.id : undefined;
        const triage = await service.findById(params.triageId, therapistId);
        const dto = HistoricSerieReportsDTO.fromTriageEntity(triage);
        const result = await htmlToPdf.generate<HistoricSerieReportsDTO>('reports/historic-serie', dto);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async fileOrientations(params: any): Promise<ResponseHttpController> {
        const service = new TriageService();
        const therapistId = params.jwtObject?.userType === 'therapist' ? params.jwtObject.id : undefined;
        const triage = await service.findById(params.triageId, therapistId);
        const dto = OrientationsReportsDTO.fromTriageEntity(triage);
        const result = await htmlToPdf.generate<OrientationsReportsDTO>('reports/orientations', dto);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async fileRetest(params: any): Promise<ResponseHttpController> {
        const service = new TriageService();
        const therapistId = params.jwtObject?.userType === 'therapist' ? params.jwtObject.id : undefined;
        const triage = await service.findById(params.triageId, therapistId);
        const dto = TestReportsDTO.fromTriageEntity(triage);
        const result = await htmlToPdf.generate<TestReportsDTO>('reports/retest', dto);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async fileTest(params: any): Promise<ResponseHttpController> {
        const service = new TriageService();
        const therapistId = params.jwtObject?.userType === 'therapist' ? params.jwtObject.id : undefined;
        const triage = await service.findById(params.triageId, therapistId);
        const dto = TestReportsDTO.fromTriageEntity(triage);
        const result = await htmlToPdf.generate<TestReportsDTO>('reports/test', dto);
        return { httpStatus: HttpStatus.OK, result };
    }
}
