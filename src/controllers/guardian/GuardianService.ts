import { Guardian } from '../../entity/guardian/Guardian';
import { AddressComponent } from '../../entity/decorators/components/Address';
import CryptoHelper from '../../helpers/CryptoHelper';
import GuardianRepository from './GuardianRepository';
import dataSource from '../../config/DataSource';
import {EntityManager} from "typeorm/entity-manager/EntityManager";
import CityRepository from '../secretary/city/CityRepository';

export default class GuardianService {
    private guardianRepository: GuardianRepository;
    private cityRepository: CityRepository;

    constructor() {
        this.guardianRepository = new GuardianRepository();
        this.cityRepository = new CityRepository();
    }

    private async processAddress(addressData: any, fullPayload?: any): Promise<AddressComponent> {
        if (!addressData) return addressData;

        // 1) Fluxo antigo: address.city.id (select)
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

        // 2) Novo fluxo (igual Instituição): city_name + state_uf
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

    public async bulkCreate(guardians: Guardian[], generateUser: boolean, manager?: EntityManager): Promise<Guardian[]> {
        const promiseGuardians: Promise<Guardian>[] = [];
        for(let index = 0; index < guardians.length; index++) {
            let promiseCreate: Promise<Guardian>;

            if(manager) {
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
        await queryRunner.startTransaction();
        const manager = queryRunner.manager;
        try {
            guardian = await this.addGuardianToTransaction(guardian, generateUser, manager);

            await queryRunner.commitTransaction();
            return guardian;
        }catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
    }

    public async addGuardianToTransaction(guardian: Guardian, generateUser: boolean, manager?: EntityManager): Promise<Guardian> {
        // Permite cadastrar endereço no mesmo formato do cadastro de Instituição (ViaCEP preenchendo UF/Cidade)
        const anyGuardian = guardian as any;
        if (anyGuardian?.address) {
            anyGuardian.address = await this.processAddress(anyGuardian.address, anyGuardian);
        }

        if(generateUser) {
            guardian.login = this.createUserName(guardian.name, guardian.birthDate);
            guardian.password = CryptoHelper.encrypt(this.createPassword());
        }
        guardian = await this.guardianRepository.save(guardian, manager);
        guardian.emails = await this.guardianRepository.saveEmails(guardian.id, guardian.emails as unknown as string[], manager);
        guardian.phones = await this.guardianRepository.savePhones(guardian.id, guardian.phones as unknown as string[], manager);

        return guardian;
    }

    private createUserName(name: string, birthDate: Date): string {
        const birthDateSliced = birthDate.toString().split('-');
        return name.toLowerCase().replaceAll(' ', '.') + birthDateSliced[2] + birthDateSliced[1] + birthDateSliced[0];
    }

    private createPassword(): string {
        return Buffer.from('p'+Math.random(), 'utf8').toString('base64').substring(0, 6);
    }
}
