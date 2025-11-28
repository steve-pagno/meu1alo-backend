import { HttpStatus } from '../../../../helpers/http/AbstractHttpErrors';
import { ResponseHttpController } from '../../../../helpers/http/AbstractRoutesTypes';
import HtmlToPdfBuffer from '../../../../helpers/HtmlToPdfBuffer';
import TriageService from '../TriageService';
import HistoricSerieReportsDTO from './dto/HistoricSerieReportsDTO';
import OrientationsReportsDTO from './dto/OrientationsReportsDTO';
import TestReportsDTO from './dto/TestReportsDTO';

const htmlToPdf = new HtmlToPdfBuffer();

export default class TriageReportsController {
    public async fileHistoricSerie(params: { triageId: number }): Promise<ResponseHttpController> {
        const service = new TriageService();
        const triage = await service.findById(params.triageId);
        const dto = HistoricSerieReportsDTO.fromTriageEntity(triage);
        const result = await htmlToPdf.generate<HistoricSerieReportsDTO>('reports/historic-serie', dto);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async fileOrientations(params: { triageId: number }): Promise<ResponseHttpController> {
        const service = new TriageService();
        const triage = await service.findById(params.triageId);
        const dto = OrientationsReportsDTO.fromTriageEntity(triage);
        const result = await htmlToPdf.generate<OrientationsReportsDTO>('reports/orientations', dto);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async fileRetest(params: { triageId: number }): Promise<ResponseHttpController> {
        const service = new TriageService();
        const triage = await service.findById(params.triageId);
        const dto = TestReportsDTO.fromTriageEntity(triage);
        const result = await htmlToPdf.generate<TestReportsDTO>('reports/retest', dto);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async fileTest(params: { triageId: number }): Promise<ResponseHttpController> {
        const service = new TriageService();
        const triage = await service.findById(params.triageId);
        const dto = TestReportsDTO.fromTriageEntity(triage);
        const result = await htmlToPdf.generate<TestReportsDTO>('reports/test', dto);
        return { httpStatus: HttpStatus.OK, result };
    }
}
