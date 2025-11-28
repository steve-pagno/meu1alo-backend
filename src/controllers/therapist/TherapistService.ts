import { Therapist } from '../../entity/therapist/Therapist';
import { NotFoundTherapistError, OnFindTherapistError } from './TherapistErrors';
import TherapistRepository from './TherapistRepository';
import { TherapistIdName, TherapistXP, TherapistXPString } from './TherapistTypes';
import dataSource from "../../config/DataSource";

export default class TherapistService {
    private therapistRepository: TherapistRepository;

    constructor() {
        this.therapistRepository = new TherapistRepository();
    }

    public async create(therapist: Therapist, emails: any[], phones: any[]): Promise<Therapist> {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        const manager = queryRunner.manager;
        try {
            therapist = await this.therapistRepository.save(therapist, manager);
            therapist.emails = await this.therapistRepository.saveEmails(therapist.id, emails, manager);
            therapist.phones = await this.therapistRepository.savePhones(therapist.id, phones, manager);

            await queryRunner.commitTransaction();
            return therapist;
        }catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
    }


    public async isATherapistUser(therapist: Therapist): Promise<void> {
        const therapist2 = await this.therapistRepository.findLogin(therapist);

        if(therapist2){
            throw new OnFindTherapistError(therapist2.id.toString());
        }
    }

    public async isAExistentTherapist(therapistId: number): Promise<Therapist> {
        const therapist = await this.therapistRepository.getEditableFields(therapistId);

        if(!therapist){
            throw new NotFoundTherapistError(therapistId.toString());
        }
        return therapist;
    }

    public async getDashboard(): Promise<{type: string}[]> {
        return [
            { type: 'baby-pass-fail' },
            // { type: 'baby-come-born' },
            { type: 'indicators-percent' },
            { type: 'indicators' },
            { type: 'equipment' }
        ];
    }

    public async getXpTypes(): Promise<TherapistIdName[]> {
        return Object.keys(TherapistXP).map((key) => (
            { id: key, name: TherapistXP[key as TherapistXPString] }
        ));
    }

}
