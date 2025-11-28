import { HttpStatus } from '../../helpers/http/AbstractHttpErrors';
import { Institution } from '../../entity/institution/Institution';
import { Therapist } from '../../entity/therapist/Therapist';
import CryptoHelper from '../../helpers/CryptoHelper';
import TherapistService from './TherapistService';
import { TherapistXP, TherapistXPString } from './TherapistTypes';

export default class TherapistController {
    public async create(therapist: Therapist) {
        const therapistService = new TherapistService();

        therapist.xp = TherapistXP[therapist.xp as unknown as TherapistXPString];
        therapist.institutions = therapist.institutions.map((i) => ({ id: i })) as unknown as Institution[];

        await therapistService.isATherapistUser(therapist);

        therapist.password = CryptoHelper.encrypt(therapist.password);
        const result = await therapistService.create(therapist, therapist.emails, therapist.phones);

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getEditableFields(params: {id: number}) {
        const therapistService = new TherapistService();

        const therapistId = params.id;
        const therapist = await therapistService.isAExistentTherapist(Number(therapistId));

        const result: any = { ...therapist };
        result.xp = { id: 'LESS_ONE', name: 'Menos de 1 ano' }; //TODO: tem que consultar isso do banco

        return { httpStatus: HttpStatus.OK, result };
    }

    public async getDashboard() {
        const therapistService = new TherapistService();
        const result = await therapistService.getDashboard();
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getXpTypes() {
        const therapistService = new TherapistService();
        const result = await therapistService.getXpTypes();
        return { httpStatus: HttpStatus.OK, result };
    }
}
