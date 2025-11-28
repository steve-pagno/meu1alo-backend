import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { Institution } from '../../entity/institution/Institution';
import { InstitutionEmail } from '../../entity/institution/InstitutionEmail';
import { InstitutionPhone } from '../../entity/institution/InstitutionPhone';
import { InstitutionUser } from '../../entity/institution/InstitutionUser';
import { DuplicateEmail, DuplicatePhone } from '../TemplateErrors';

export default class InstitutionRepository {

    public async findIdsSimilar(institutionName: string, cnes: string, limit?: number): Promise<{ id: number }[]>{
        let query = Institution
            .createQueryBuilder('i')
            .where('i.institutionName = :institutionName', { institutionName })
            .orWhere('i.cnes = :cnes', { cnes })
            .select(['i.id AS id'])
        ;
        if(limit) {
            query = query.limit(limit);
        }
        return query.execute();
    }

    public async findOne(options: object): Promise<Institution | null>{
        return Institution.findOne(options);
    }

    public async findAll(options?: object, limit?: number): Promise<Institution[] | undefined>{
        let query = Institution
            .createQueryBuilder('i')
            .select(['i.id AS id', 'i.institutionName AS name'])
            .orderBy('name','DESC');
        if(limit) {
            query = query.limit(limit);
        }
        return query.execute();
    }

    public async save(institution: Institution, transaction?: EntityManager): Promise<Institution>{
        if(transaction) {
            return transaction.getRepository(Institution).save(institution);
        }
        return Institution.save(institution);
    }

    public saveEmails(id: number, emails: string[], transaction?: EntityManager): Promise<InstitutionEmail[]>{
        const entities = emails.filter(email => email && email.length > 1).map((email) => {
            const entity = new InstitutionEmail();
            entity.email = email;
            entity.user = { id } as InstitutionUser;//TODO: adicionar nos emails e phones o campo isMain
            return entity;
        });

        try {
            if(transaction) {
                return transaction.getRepository(InstitutionEmail).save(entities);
            }
            return InstitutionEmail.save(entities);
        } catch (e: any) {
            throw new DuplicateEmail(e.message);
        }
    }

    public savePhones(id: number, phones: string[], transaction?: EntityManager): Promise<InstitutionPhone[]>{
        const entities = phones.filter(phone => phone && phone.length > 1).map((number) => {
            const entity = new InstitutionPhone();
            entity.phoneNumber = number;
            entity.user = { id } as InstitutionUser;
            return entity;
        });

        try {
            if(transaction) {
                return transaction.getRepository(InstitutionPhone).save(entities);
            }
            return InstitutionPhone.save(entities);
        } catch (e: any) {
            throw new DuplicatePhone(e.message);
        }
    }
}
