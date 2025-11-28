import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { Institution, } from '../../entity/institution/Institution';
import { InstitutionEmail } from '../../entity/institution/InstitutionEmail';
import { InstitutionPhone } from '../../entity/institution/InstitutionPhone';
import { DuplicateInstitutionError, InstitutionTypeError, NotFoundInstitutionError, NotFoundOneInstitutionError } from './InstitutionErrors';
import InstitutionRepository from './InstitutionRepository';
import { InstitutionPayload, InstitutionString, InstitutionType } from './InstitutionTypes';

export default class InstitutionService {
    private institutionRepository: InstitutionRepository;

    constructor() {
        this.institutionRepository = new InstitutionRepository();
    }

    public async noSimilarOrError({ cnes, institutionName }: InstitutionPayload): Promise<void> {
        const results = await this.institutionRepository.findIdsSimilar(institutionName, cnes, 1);
        const institution2 = results[0];
        if(institution2){
            throw new DuplicateInstitutionError(institution2.id.toString());
        }
    }

    public async findOneById(id: number | string): Promise<Institution | undefined> {
        const institution = await this.institutionRepository.findOne({ id: id as number });

        if(!institution) {
            throw new NotFoundOneInstitutionError();
        }

        return institution;
    }

    public async findAll(): Promise<Institution[]> {
        const institutions = await this.institutionRepository.findAll();

        if(!institutions || institutions.length <= 0) {
            throw new NotFoundInstitutionError();
        }

        return institutions;
    }

    public async getInstitutionType(institutionType: InstitutionString): Promise<InstitutionType> {
        try {
            return InstitutionType[institutionType];
        }catch (e: any){
            throw new InstitutionTypeError(e.message);
        }
    }

    public async getDashboard(): Promise<{ type: string }[]> {
        return [
            { type: 'baby-pass-fail' },
            // { type: 'baby-come-born' },
            { type: 'indicators-percent' },
            { type: 'indicators' }
        ];
    }

    public async getInstitutionTypes() {
        return Object.keys(InstitutionType).map((key) => (
            { id: key, name: InstitutionType[key as InstitutionString] }
        ));
    }

    public async create(institution: InstitutionPayload, transaction?: EntityManager): Promise<Institution | { id: number }> {
        if(!institution){
            throw new NotFoundOneInstitutionError();
        }

        if(institution.id) {
            return { id: institution.id };
        }

        institution.institutionType = await this.getInstitutionType(institution.institutionType as InstitutionString);

        if(institution.cnpj && institution.cnpj.length > 14) {
            institution.cnpj = institution.cnpj
                .replaceAll('.', '')
                .replaceAll('-', '')
                .replaceAll('/', '');
        }

        await this.noSimilarOrError(institution);

        return this.institutionRepository.save(institution as Institution, transaction);
    }

    public saveEmails(id: number, emails: string[], transaction?: EntityManager): Promise<InstitutionEmail[]>{
        return this.institutionRepository.saveEmails(id, emails, transaction);
    }

    public savePhones(id: number, phones: string[], transaction?: EntityManager): Promise<InstitutionPhone[]>{
        return this.institutionRepository.savePhones(id, phones, transaction);
    }
}
