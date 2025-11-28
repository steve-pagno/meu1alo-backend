import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { Guardian } from '../../entity/guardian/Guardian';
import { GuardianEmail } from '../../entity/guardian/GuardianEmail';
import { GuardianPhone } from '../../entity/guardian/GuardianPhone';
import { DuplicateEmail, DuplicatePhone } from '../TemplateErrors';

export default class GuardianRepository {
    public async save(guardian: Guardian, transaction?: EntityManager): Promise<Guardian> {
        if(transaction) {
            return transaction.getRepository(Guardian).save(guardian);
        }
        return Guardian.save(guardian);
    }

    public saveEmails(id: number, emails: string[], transaction?: EntityManager): Promise<GuardianEmail[]>{
        const entities = emails.filter(email => email && email.length > 1).map((email) => {
            const entity = new GuardianEmail();
            entity.email = email;
            entity.guardian = { id } as Guardian;
            return entity;
        });

        try {
            if(transaction) {
                return transaction.getRepository(GuardianEmail).save(entities);
            }
            return GuardianEmail.save(entities);
        } catch (e: any) {
            throw new DuplicateEmail(e.message);
        }
    }

    public savePhones(id: number, phones: string[], transaction?: EntityManager): Promise<GuardianPhone[]>{
        const entities = phones.filter(phone => phone && phone.length > 1).map((number) => {
            const entity = new GuardianPhone();
            entity.phoneNumber = number;
            entity.guardian = { id } as Guardian;
            return entity;
        });

        try {
            if(transaction) {
                return transaction.getRepository(GuardianPhone).save(entities);
            }
            return GuardianPhone.save(entities);
        } catch (e: any) {
            throw new DuplicatePhone(e.message);
        }
    }
}
