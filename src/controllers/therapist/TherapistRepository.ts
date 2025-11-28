import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { Therapist } from '../../entity/therapist/Therapist';
import { TherapistEmail } from '../../entity/therapist/TherapistEmail';
import { TherapistPhone } from '../../entity/therapist/TherapistPhone';
import { DuplicateEmail, DuplicatePhone } from '../TemplateErrors';

export default class TherapistRepository {

    public findLogin({ login }: Therapist): Promise<{ id: number } | undefined>{
        const query = Therapist.createQueryBuilder('therapist')
            .select(['therapist.id AS id'])
            .where('therapist.login = :login', { login: login });
        return query.getRawOne();
    }

    public getEditableFields(therapistId: number): Promise<Therapist | undefined>{
        const query = Therapist.createQueryBuilder('therapist')
            .select([
                'therapist.crfa AS crfa',
                'therapist.xp AS xp',
                'therapist.id AS id',
                'therapist.login AS login',
                'therapist.name AS name'
            ])
            .where('therapist.id = :id', { id: therapistId });
        return query.getRawOne();
    }

    public save(therapist: Therapist, transaction?: EntityManager): Promise<Therapist>{
        if(transaction) {
            return transaction.getRepository(Therapist).save(therapist);
        }
        return Therapist.save(therapist);
    }

    public saveEmails(id: number, emails: string[], transaction?: EntityManager): Promise<TherapistEmail[]>{
        const entities = emails.filter(email => email && email.length > 1).map((email) => {
            const entity = new TherapistEmail();
            entity.email = email;
            entity.therapist = { id } as Therapist;
            return entity;
        });

        try {
            if(transaction) {
                return transaction.getRepository(TherapistEmail).save(entities);
            }
            return TherapistEmail.save(entities);
        } catch (e: any) {
            throw new DuplicateEmail(e.message);
        }
    }

    public savePhones(id: number, phones: string[], transaction?: EntityManager): Promise<TherapistPhone[]>{
        const entities = phones.filter(phone => phone && phone.length > 1).map((number) => {
            const entity = new TherapistPhone();
            entity.phoneNumber = number;
            entity.therapist = { id } as Therapist;
            return entity;
        });

        try {
            if(transaction) {
                return transaction.getRepository(TherapistPhone).save(entities);
            }
            return TherapistPhone.save(entities);
        } catch (e: any) {
            throw new DuplicatePhone(e.message);
        }
    }
}
