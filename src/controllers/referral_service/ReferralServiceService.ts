import { ReferralService, ReferralServiceType, ReferralServiceTypeString } from '../../entity/referral_service/ReferralService';
import { AddressComponent } from '../../entity/decorators/components/Address';
import CityRepository from '../secretary/city/CityRepository';
import ReferralServiceRepository from './ReferralServiceRepository';

export default class ReferralServiceService {
    private readonly referralServiceRepository: ReferralServiceRepository;
    private readonly cityRepository: CityRepository;

    constructor() {
        this.referralServiceRepository = new ReferralServiceRepository();
        this.cityRepository = new CityRepository();
    }

    private async processAddress(addressData: any, fullPayload?: any): Promise<AddressComponent> {
        if (!addressData) return addressData;

        // 1) Se veio city.id (fluxo antigo com select), respeita.
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

    /**
     * Aceita tanto o payload antigo (address.city.id) quanto o novo (address.city_name + address.state_uf)
     * para permitir a mesma experiência do cadastro de Instituição (ViaCEP preenchendo UF/Cidade por texto).
     */
    public async create(payload: any) {
        if (!payload) throw new Error('Payload inválido.');

        const referralService = new ReferralService();
        referralService.name = payload.name;
        referralService.cnpj = payload.cnpj ? String(payload.cnpj).replace(/\D/g, '') : '';
        referralService.cnes = payload.cnes;
        referralService.typeService = payload.typeService;

        if (payload.address) {
            referralService.address = await this.processAddress(payload.address, payload);
        }

        // emails/phones continuam chegando como arrays simples no payload; o TypeORM cascade salva.
        referralService.emails = payload.emails;
        referralService.phones = payload.phones;

        return this.referralServiceRepository.create(referralService);
    }

    public async listType() {
        return Object.keys(ReferralServiceType).map((key) => (
            { id: key, name: ReferralServiceType[key as ReferralServiceTypeString] }
        ));
    }
}