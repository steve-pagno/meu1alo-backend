import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { Institution } from '../../entity/institution/Institution';
import { InstitutionEmail } from '../../entity/institution/InstitutionEmail';
import { InstitutionPhone } from '../../entity/institution/InstitutionPhone';
import { DuplicateInstitutionError, InstitutionTypeError, NotFoundInstitutionError, NotFoundOneInstitutionError } from './InstitutionErrors';
import InstitutionRepository from './InstitutionRepository';
import { InstitutionPayload, InstitutionString, InstitutionType } from './InstitutionTypes';
import CityRepository from '../secretary/city/CityRepository';
import { AddressComponent } from '../../entity/decorators/components/Address';

export default class InstitutionService {
    private institutionRepository: InstitutionRepository;
    private cityRepository: CityRepository;

    constructor() {
        this.institutionRepository = new InstitutionRepository();
        this.cityRepository = new CityRepository();
    }

    private async processAddress(addressData: any, fullPayload?: any): Promise<AddressComponent> {
        if (!addressData) return addressData;

        // Tenta pegar city_name e state_uf do addressData ou do payload principal
        const cityName = addressData.city_name || fullPayload?.city_name;
        const stateUf = addressData.state_uf || fullPayload?.state_uf;

        if (!cityName || !stateUf) {
            throw new Error(`Dados de localização incompletos: cidade ou UF não informados.`);
        }

        const cityEntity = await this.cityRepository.getByNameAndState(cityName, stateUf);

        if (!cityEntity) {
            throw new Error(`Município '${cityName} - ${stateUf}' não encontrado no banco de dados.`);
        }

        const address = new AddressComponent();
        address.street = addressData.street || addressData.rua;
        address.number = addressData.number || addressData.numero;
        address.adjunct = addressData.adjunct || addressData.complemento;
        address.cep = (addressData.cep || "").replace(/\D/g, ''); 
        address.city = cityEntity; 

        return address;
    }

    public async create(payload: any, transaction?: EntityManager): Promise<Institution | { id: number }> {
        if(!payload){
            throw new NotFoundOneInstitutionError();
        }

        if(payload.id) {
            return { id: payload.id };
        }

        const institution = new Institution();
        institution.institutionName = payload.institutionName;
        institution.cnes = payload.cnes;
        institution.cnpj = payload.cnpj ? payload.cnpj.replace(/\D/g, '') : '';
        
        institution.institutionType = await this.getInstitutionType(payload.institutionType as InstitutionString);

        if (payload.address) {
            // Passamos o payload completo também como fallback
            institution.address = await this.processAddress(payload.address, payload);
        }

        await this.noSimilarOrError(payload);

        return this.institutionRepository.save(institution, transaction);
    }

    // Métodos obrigatórios para o Controller funcionar
    public async getDashboard() {
        return [{ type: 'baby-pass-fail' }, { type: 'indicators-percent' }, { type: 'indicators' }];
    }

    public async getInstitutionTypes() {
        return Object.keys(InstitutionType).map((key) => ({ id: key, name: InstitutionType[key as keyof typeof InstitutionType] }));
    }

    public async noSimilarOrError({ cnes, institutionName }: any): Promise<void> {
        const results = await this.institutionRepository.findIdsSimilar(institutionName, cnes, 1);
        if(results[0]) throw new DuplicateInstitutionError(results[0].id.toString());
    }

    public async getInstitutionType(type: any): Promise<InstitutionType> {
        try { return InstitutionType[type as InstitutionString]; } 
        catch (e: any) { throw new InstitutionTypeError(e.message); }
    }

    public async findOneById(id: number) { return this.institutionRepository.findOne({ id }); }
    public async findAll() { return this.institutionRepository.findAll(); }
    public async saveEmails(id: number, emails: string[], t?: EntityManager) { return this.institutionRepository.saveEmails(id, emails, t); }
    public async savePhones(id: number, phones: string[], t?: EntityManager) { return this.institutionRepository.savePhones(id, phones, t); }
}