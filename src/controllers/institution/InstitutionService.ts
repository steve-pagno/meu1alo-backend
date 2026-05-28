import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { InstitutionUser } from '../../entity/institution/InstitutionUser';
import { Institution } from '../../entity/institution/Institution';
import { InstitutionEmail } from '../../entity/institution/InstitutionEmail';
import { InstitutionPhone } from '../../entity/institution/InstitutionPhone';
import { DuplicateInstitutionError, InstitutionTypeError, NotFoundInstitutionError, NotFoundOneInstitutionError } from './InstitutionErrors';
import InstitutionRepository from './InstitutionRepository';
import { InstitutionPayload, InstitutionString, InstitutionType } from './InstitutionTypes';
import CityRepository from '../secretary/city/CityRepository';
import { AddressComponent } from '../../entity/decorators/components/Address';
import dataSource from '../../config/DataSource';

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

    public async findOneById(id: number) { return this.institutionRepository.findOne({ where: { id } }); }
    
    public async findUserById(userId: number) {
        return InstitutionUser.createQueryBuilder('u')
            .leftJoinAndSelect('u.institution', 'institution')
            .leftJoinAndSelect('u.emails', 'emails')
            .leftJoinAndSelect('u.phones', 'phones')
            .leftJoinAndSelect('institution.address.city', 'city')
            .leftJoinAndSelect('city.state', 'state')
            .where('u.id = :id', { id: userId })
            .getOne();
    }

    public async findAll() { return this.institutionRepository.findAll(); }
    public async saveEmails(id: number, emails: string[], t?: EntityManager) { return this.institutionRepository.saveEmails(id, emails, t); }
    public async savePhones(id: number, phones: string[], t?: EntityManager) { return this.institutionRepository.savePhones(id, phones, t); }

    public async update(id: number, updateData: any) {
        if (updateData.password && updateData.password !== updateData.passwordConfirm) {
            throw new Error('As senhas não coincidem.');
        }

        if (updateData.password) {
            const CryptoHelper = require('../../helpers/CryptoHelper').default;
            updateData.password = CryptoHelper.encrypt(updateData.password);
        } else {
            delete updateData.password;
        }
        delete updateData.passwordConfirm;
        delete updateData.jwtObject;

        // Map responsible fields to user entity fields
        if (updateData.responsibleName !== undefined) {
            updateData.name = updateData.responsibleName;
            delete updateData.responsibleName;
        }
        if (updateData.responsibleRole !== undefined) {
            updateData.role = updateData.responsibleRole;
            delete updateData.responsibleRole;
        }

        // Map emails and phones from frontend to strings arrays
        let emailStrings: string[] = [];
        if (updateData.emails) {
            const rawEmails = Array.isArray(updateData.emails) ? updateData.emails : Object.values(updateData.emails);
            emailStrings = rawEmails.filter((e: any) => e).map((e: any) => typeof e === 'string' ? e : e?.email);
            delete updateData.emails;
        } else if (updateData.email || updateData.alternativeEmail) {
            emailStrings = [updateData.email, updateData.alternativeEmail].filter((e): e is string => typeof e === 'string' && e.trim() !== '');
            delete updateData.email;
            delete updateData.alternativeEmail;
        }

        let phoneStrings: string[] = [];
        if (updateData.phones) {
            const rawPhones = Array.isArray(updateData.phones) ? updateData.phones : Object.values(updateData.phones);
            phoneStrings = rawPhones.filter((p: any) => p).map((p: any) => typeof p === 'string' ? p : p?.phoneNumber);
            delete updateData.phones;
        } else if (updateData.institutionPhone || updateData.institutionCellphone) {
            phoneStrings = [updateData.institutionPhone, updateData.institutionCellphone].filter((p): p is string => typeof p === 'string' && p.trim() !== '');
            delete updateData.institutionPhone;
            delete updateData.institutionCellphone;
        }

        // Tentar formatar CNES e CNPJ e Type e Address se vieram
        if (updateData.cnpj) updateData.cnpj = updateData.cnpj.replace(/\D/g, '');
        if (updateData.cnes) updateData.cnes = updateData.cnes.replace(/\D/g, '');

        if (updateData.institutionType) {
            updateData.institutionType = await this.getInstitutionType(updateData.institutionType);
        }

        if (updateData.cep || updateData.publicArea) {
             const addressData = {
                 cep: updateData.cep,
                 street: updateData.publicArea,
                 number: updateData.number,
                 adjunct: updateData.complement,
                 city_name: updateData.city,
                 state_uf: updateData.state
             };
             try {
                updateData.address = await this.processAddress(addressData);
             } catch(e) {}
             
             delete updateData.cep;
             delete updateData.publicArea;
             delete updateData.number;
             delete updateData.complement;
             delete updateData.city;
             delete updateData.state;
        }

        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const manager = queryRunner.manager;

        try {
            // Delete old emails and phones
            await this.institutionRepository.deleteEmails(id, manager);
            await this.institutionRepository.deletePhones(id, manager);

            // Update InstitutionUser and Institution
            const updatedUser = await this.institutionRepository.update(id, updateData, manager);

            // Save new emails and phones
            if (emailStrings.length > 0) {
                await this.institutionRepository.saveEmails(id, emailStrings, manager);
            }
            if (phoneStrings.length > 0) {
                await this.institutionRepository.savePhones(id, phoneStrings, manager);
            }

            await queryRunner.commitTransaction();
            return updatedUser;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    public async getTriages(userId: number, query: any) {
        const ReportsRepository = require('../reports/ReportsRepository').default;
        const reportsRepository = new ReportsRepository();
        const institutionId = await reportsRepository.getInstitutionsIDsOfInstitutionUser(userId);

        const TriageRepository = require('../therapist/triage/TriageRepository').default;
        const triageRepository = new TriageRepository();

        return triageRepository.getAllByInstitution(institutionId, query);
    }

    public async getTherapists(userId: number) {
        const ReportsRepository = require('../reports/ReportsRepository').default;
        const reportsRepository = new ReportsRepository();
        const institutionId = await reportsRepository.getInstitutionsIDsOfInstitutionUser(userId);

        const { Therapist } = await import('../../entity/therapist/Therapist');
        const therapists = await Therapist.createQueryBuilder('therapist')
            .innerJoin('therapist.institutions', 'institution')
            .leftJoinAndSelect('therapist.emails', 'emails')
            .leftJoinAndSelect('therapist.phones', 'phones')
            .where('institution.id = :institutionId', { institutionId })
            .getMany();

        return therapists;
    }

    public async checkTherapistByCrfa(crfa: string) {
        const { Therapist } = await import('../../entity/therapist/Therapist');
        const therapist = await Therapist.findOne({
            relations: ['emails', 'phones', 'institutions'],
            where: { crfa: crfa.replace(/\D/g, '') }
        });
        return therapist || null;
    }

    public async addOrRegisterTherapist(userId: number, payload: any) {
        const ReportsRepository = require('../reports/ReportsRepository').default;
        const reportsRepository = new ReportsRepository();
        const institutionId = await reportsRepository.getInstitutionsIDsOfInstitutionUser(userId);

        const institution = await this.findOneById(Number(institutionId));
        if (!institution) {
            throw new NotFoundInstitutionError();
        }

        const { Therapist } = await import('../../entity/therapist/Therapist');

        if (payload.therapistId) {
            const therapist = await Therapist.findOne({
                where: { id: Number(payload.therapistId) },
                relations: ['institutions', 'emails']
            });
            if (!therapist) {
                throw new Error('Fonoaudiólogo não encontrado.');
            }

            if (!therapist.institutions.some(i => i.id === institution.id)) {
                await dataSource.createQueryBuilder()
                    .relation(Therapist, "institutions")
                    .of(therapist.id)
                    .add(institution.id);

                try {
                    const mainEmail = therapist.emails?.find(e => e.isMainEmail)?.email || therapist.emails?.[0]?.email;
                    if (mainEmail) {
                        const { EmailService } = require('../../services/EmailService');
                        await EmailService.sendTherapistInstitutionAssociationEmail(
                            mainEmail,
                            therapist.name,
                            institution.institutionName
                        );
                    }
                } catch (emailErr) {
                    console.error("Erro ao enviar e-mail de vínculo de fonoaudiólogo (existente):", emailErr);
                }
            }
            return therapist;
        } else {
            const TherapistService = require('../therapist/TherapistService').default;
            const therapistService = new TherapistService();

            const therapist = new Therapist();
            therapist.name = payload.name;
            therapist.login = payload.login;
            therapist.password = payload.password;
            therapist.crfa = payload.crfa.replace(/\D/g, '');

            const { TherapistXP } = require('../therapist/TherapistTypes');
            therapist.xp = TherapistXP[payload.xp as any];

            await therapistService.isATherapistUser(therapist);

            const CryptoHelper = require('../../helpers/CryptoHelper').default;
            therapist.password = CryptoHelper.encrypt(therapist.password);

            const emailsPayload = (payload.emails || []).map((emailStr: string, idx: number) => {
                const { TherapistEmail } = require('../../entity/therapist/TherapistEmail');
                const emailObj = new TherapistEmail();
                emailObj.email = emailStr;
                emailObj.isPrincipal = idx === 0;
                return emailObj;
            });

            const phonesPayload = (payload.phones || []).map((phoneStr: string, idx: number) => {
                const { TherapistPhone } = require('../../entity/therapist/TherapistPhone');
                const phoneObj = new TherapistPhone();
                phoneObj.phoneNumber = phoneStr;
                phoneObj.isPrincipal = idx === 0;
                return phoneObj;
            });

            const result = await therapistService.create(therapist, emailsPayload, phonesPayload);
            
            await dataSource.createQueryBuilder()
                .relation(Therapist, "institutions")
                .of(result.id)
                .add(institution.id);

            try {
                const mainEmail = payload.emails?.[0];
                if (mainEmail) {
                    const { EmailService } = require('../../services/EmailService');
                    await EmailService.sendTherapistInstitutionAssociationEmail(
                        mainEmail,
                        result.name,
                        institution.institutionName
                    );
                }
            } catch (emailErr) {
                console.error("Erro ao enviar e-mail de vínculo de fonoaudiólogo (novo):", emailErr);
            }

            return result;
        }
    }

    public async removeTherapist(userId: number, therapistId: number) {
        const ReportsRepository = require('../reports/ReportsRepository').default;
        const reportsRepository = new ReportsRepository();
        const institutionId = await reportsRepository.getInstitutionsIDsOfInstitutionUser(userId);

        const { Therapist } = await import('../../entity/therapist/Therapist');
        
        await dataSource.createQueryBuilder()
            .relation(Therapist, "institutions")
            .of(therapistId)
            .remove(Number(institutionId));

        return { success: true };
    }
}