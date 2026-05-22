import { Guardian } from '../../entity/guardian/Guardian';
import { AddressComponent } from '../../entity/decorators/components/Address';
import CryptoHelper from '../../helpers/CryptoHelper';
import GuardianRepository from './GuardianRepository';
import dataSource from '../../config/DataSource';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import CityRepository from '../secretary/city/CityRepository';

export default class GuardianService {
    private guardianRepository: GuardianRepository;
    private cityRepository: CityRepository;

    constructor() {
        this.guardianRepository = new GuardianRepository();
        this.cityRepository = new CityRepository();
    }

    private normalizeCpf(cpf?: string): string {
        return String(cpf || '').replace(/\D/g, '');
    }

    private async processAddress(addressData: any, fullPayload?: any): Promise<AddressComponent> {
        if (!addressData) return addressData;

        const cityIdRaw = addressData?.city?.id ?? addressData?.city_id ?? addressData?.cityId;
        if (cityIdRaw !== undefined && cityIdRaw !== null && cityIdRaw !== '') {
            const cityId = Number(cityIdRaw);
            if (!Number.isNaN(cityId)) {
                const cityEntity = await this.cityRepository.getById(cityId);
                if (!cityEntity) throw new Error(`Município (id=${cityId}) não encontrado no banco de dados.`);

                const address = new AddressComponent();
                address.street = addressData.street || addressData.rua;
                address.number = addressData.number || addressData.numero;
                address.adjunct = addressData.adjunct || addressData.complemento;
                address.cep = (addressData.cep || '').replace(/\D/g, '');
                address.city = cityEntity;
                return address;
            }
        }

        const cityName = addressData.city_name || fullPayload?.city_name;
        const stateUf = addressData.state_uf || fullPayload?.state_uf;

        if (!cityName || !stateUf) {
            throw new Error('Dados de localização incompletos: cidade ou UF não informados.');
        }

        const cityEntity = await this.cityRepository.getByNameAndState(cityName, stateUf);
        if (!cityEntity) {
            throw new Error(`Município '${cityName} - ${stateUf}' não encontrado no banco de dados.`);
        }

        const address = new AddressComponent();
        address.street = addressData.street || addressData.rua;
        address.number = addressData.number || addressData.numero;
        address.adjunct = addressData.adjunct || addressData.complemento;
        address.cep = (addressData.cep || '').replace(/\D/g, '');
        address.city = cityEntity;
        return address;
    }

    public async getPublicByCpf(cpf: string) {
        const normalizedCpf = this.normalizeCpf(cpf);
        if (!normalizedCpf || normalizedCpf.length !== 11) {
            throw new Error('CPF inválido.');
        }

        const guardian = await this.guardianRepository.findByCpf(normalizedCpf);
        if (!guardian) return null;

        const { Baby } = require('../../entity/baby/Baby');
        const babies = await dataSource.getRepository(Baby).createQueryBuilder('baby')
            .leftJoin('baby.guardians', 'guardian')
            .where('baby.birthMother = :guardianId OR guardian.id = :guardianId', { guardianId: guardian.id })
            .getMany();

        return {
            id: guardian.id,
            name: guardian.name,
            cpf: guardian.cpf,
            birthDate: guardian.birthDate,
            emails: Array.isArray(guardian.emails) ? guardian.emails.map((e: any) => e.email) : [],
            phones: Array.isArray(guardian.phones) ? guardian.phones.map((p: any) => p.phoneNumber) : [],
            babies: babies.map((baby: any) => ({
                id: baby.id,
                name: baby.name,
                weight: baby.weight,
                height: baby.height,
                circumference: baby.circumference,
                birthDate: baby.birthDate,
                gestationalAge: baby.gestationalAge,
                childBirthType: baby.childBirthType,
                maternalDeath: baby.maternalDeath,
            })),
        };
    }

    public async bulkCreate(guardians: Guardian[], generateUser: boolean, manager?: EntityManager): Promise<Guardian[]> {
        const promiseGuardians: Promise<Guardian>[] = [];
        for (let index = 0; index < guardians.length; index++) {
            let promiseCreate: Promise<Guardian>;

            if (manager) {
                promiseCreate = this.addGuardianToTransaction(guardians[index], generateUser, manager);
            } else {
                promiseCreate = this.create(guardians[index], generateUser);
            }

            promiseGuardians.push(promiseCreate);
        }
        return Promise.all(promiseGuardians);
    }

    public async create(guardian: Guardian, generateUser: boolean): Promise<Guardian> {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const manager = queryRunner.manager;

        try {
            guardian = await this.addGuardianToTransaction(guardian, generateUser, manager);

            await queryRunner.commitTransaction();
            return guardian;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    public async addGuardianToTransaction(guardian: Guardian, generateUser: boolean, manager?: EntityManager): Promise<Guardian> {
        const anyGuardian = guardian as any;
        const normalizedCpf = this.normalizeCpf(anyGuardian?.cpf);

        let existingGuardian: Guardian | null = null;

        if (anyGuardian?.id) {
            existingGuardian = await this.guardianRepository.getById(anyGuardian.id, manager);
            if (!existingGuardian) {
                throw new Error('Responsável informado não foi encontrado.');
            }
        } else if (normalizedCpf) {
            existingGuardian = await this.guardianRepository.findByCpf(normalizedCpf, manager);
        }

        if (existingGuardian) {
            // Update fields if they are provided
            let hasChanges = false;
            if (guardian.name && guardian.name !== existingGuardian.name) {
                existingGuardian.name = guardian.name;
                hasChanges = true;
            }
            if (guardian.birthDate && new Date(guardian.birthDate).getTime() !== new Date(existingGuardian.birthDate).getTime()) {
                existingGuardian.birthDate = guardian.birthDate;
                hasChanges = true;
            }
            if (anyGuardian.address) {
                const processedAddress = await this.processAddress(anyGuardian.address, existingGuardian);
                existingGuardian.address = processedAddress;
                hasChanges = true;
            }
            
            if (hasChanges && manager) {
                existingGuardian = await this.guardianRepository.save(existingGuardian, manager);
            }

            if (guardian.emails && guardian.emails.length > 0 && manager) {
                await this.guardianRepository.deleteEmails(existingGuardian.id, manager);
                const emailStrings = (guardian.emails as any[])
                    .map(e => typeof e === 'string' ? e : e?.email)
                    .filter(e => typeof e === 'string' && e.trim() !== '');
                if (emailStrings.length > 0) {
                    existingGuardian.emails = await this.guardianRepository.saveEmails(existingGuardian.id, emailStrings, manager);
                }
            }

            if (guardian.phones && guardian.phones.length > 0 && manager) {
                await this.guardianRepository.deletePhones(existingGuardian.id, manager);
                const phoneStrings = (guardian.phones as any[])
                    .map(p => typeof p === 'string' ? p : p?.phoneNumber)
                    .filter(p => typeof p === 'string' && p.trim() !== '');
                if (phoneStrings.length > 0) {
                    existingGuardian.phones = await this.guardianRepository.savePhones(existingGuardian.id, phoneStrings, manager);
                }
            }

            return existingGuardian;
        }

        if (normalizedCpf) {
            guardian.cpf = normalizedCpf;
        }

        if (anyGuardian?.address) {
            anyGuardian.address = await this.processAddress(anyGuardian.address, anyGuardian);
        }

        if (generateUser) {
            if (!guardian.cpf || this.normalizeCpf(guardian.cpf).length !== 11) {
                throw new Error('CPF do responsável é obrigatório para gerar acesso.');
            }

            const generatedPassword = this.createPassword();
            guardian.login = this.normalizeCpf(guardian.cpf);
            guardian.password = CryptoHelper.encrypt(generatedPassword);
            guardian.forcePasswordReset = true;

            guardian = await this.guardianRepository.save(guardian, manager);
            guardian.emails = await this.guardianRepository.saveEmails(guardian.id, guardian.emails as unknown as string[], manager);
            guardian.phones = await this.guardianRepository.savePhones(guardian.id, guardian.phones as unknown as string[], manager);

            (guardian as any).__isNewGuardian = true;
            (guardian as any).__generatedPasswordPlain = generatedPassword;
            (guardian as any).__generatedLogin = guardian.login;

            return guardian;
        }

        guardian = await this.guardianRepository.save(guardian, manager);
        guardian.emails = await this.guardianRepository.saveEmails(guardian.id, guardian.emails as unknown as string[], manager);
        guardian.phones = await this.guardianRepository.savePhones(guardian.id, guardian.phones as unknown as string[], manager);

        return guardian;
    }

    private createPassword(): string {
        return Buffer.from('p' + Math.random(), 'utf8').toString('base64').substring(0, 8);
    }
}