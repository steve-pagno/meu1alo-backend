import { Therapist } from '../../entity/therapist/Therapist';
import { NotFoundTherapistError, OnFindTherapistError } from './TherapistErrors';
import TherapistRepository from './TherapistRepository';
import { TherapistIdName, TherapistXP, TherapistXPString } from './TherapistTypes';
import dataSource from "../../config/DataSource";
import CryptoHelper from '../../helpers/CryptoHelper';

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
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
    }


    public async isATherapistUser(therapist: Therapist): Promise<void> {
        const therapist2 = await this.therapistRepository.findLogin(therapist);

        if (therapist2) {
            throw new OnFindTherapistError(therapist2.id.toString());
        }
    }

    // No arquivo TherapistService.ts
    public async isAExistentTherapist(therapistId: number): Promise<Therapist> {
        const therapist = await this.therapistRepository.getEditableFields(therapistId);

        // Esta verificação if(!therapist) já funciona tanto para null como para undefined
        if (!therapist) {
            throw new NotFoundTherapistError(therapistId.toString());
        }
        return therapist; // Aqui o TS entenderá que se passou pelo IF, o objeto existe
    }

    public async getDashboard(): Promise<{ type: string }[]> {
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

    public async update(id: number, updateData: any) {
        if (!updateData.password) {
            delete updateData.password;
        } else {
            updateData.password = CryptoHelper.encrypt(updateData.password);
        }

        // emails/phones as string array
        let emailsRecebidos = updateData.emails || [];
        if (!Array.isArray(emailsRecebidos)) {
            emailsRecebidos = Object.values(emailsRecebidos);
        }

        let phonesRecebidos = updateData.phones || [];
        if (!Array.isArray(phonesRecebidos)) {
            phonesRecebidos = Object.values(phonesRecebidos);
        }

        const emailStrings = emailsRecebidos
            .map((e: any) => typeof e === 'string' ? e : e?.email)
            .filter((e: any) => typeof e === 'string' && e.trim() !== '');

        const phoneStrings = phonesRecebidos
            .map((p: any) => typeof p === 'string' ? p : p?.phoneNumber)
            .filter((p: any) => typeof p === 'string' && p.trim() !== '');

        delete updateData.emails;
        delete updateData.phones;
        delete updateData.currentPassword;
        
        if (updateData.institutions) {
            updateData.institutions = updateData.institutions.map((i: any) => ({ id: i }));
        }
        
        if (updateData.xp) {
            updateData.xp = TherapistXP[updateData.xp as unknown as TherapistXPString];
        }

        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const manager = queryRunner.manager;

        try {
            await this.therapistRepository.deleteEmails(id, manager);
            await this.therapistRepository.deletePhones(id, manager);

            const updatedTherapist = await this.therapistRepository.update(id, updateData, manager);

            if (emailStrings.length > 0) {
                await this.therapistRepository.saveEmails(id, emailStrings, manager);
            }
            if (phoneStrings.length > 0) {
                await this.therapistRepository.savePhones(id, phoneStrings, manager);
            }

            await queryRunner.commitTransaction();
            return updatedTherapist;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
