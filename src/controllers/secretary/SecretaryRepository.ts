import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { SecretaryUser } from '../../entity/secretaries/user/SecretaryUser';
import { SecretaryEmail } from '../../entity/secretaries/user/SecretaryEmail';
import { SecretaryPhone } from '../../entity/secretaries/user/SecretaryPhone';

export default class SecretaryRepository {
    public async getDashboard() {
        return [
            { type: 'baby-pass-fail' },
            { type: 'indicators-percent' },
            { type: 'indicators' }
        ];
    }

    public async getState(userId: number) {
        return SecretaryUser.createQueryBuilder('u')
            .select(['u.state AS state'])
            .where('u.id = :id', { id: userId })
            .getRawOne();
    }

    public async create(secretaryData: any, transaction?: EntityManager) {
        const newSecretary = SecretaryUser.create(secretaryData);
        if (transaction) {
            return await transaction.getRepository(SecretaryUser).save(newSecretary);
        }
        return await SecretaryUser.save(newSecretary);
    }

    public async saveEmails(id: number, emails: string[], transaction?: EntityManager) {
        const entities = emails.map((email) => {
            const entity = new SecretaryEmail();
            entity.email = email;
            entity.user = { id } as SecretaryUser; // Deve ser '.user' conforme a Entity
            return entity;
        }); 

        // Previne erro ao tentar salvar uma lista vazia
        if (entities.length === 0) return [];

        if (transaction) {
            return await transaction.getRepository(SecretaryEmail).save(entities);
        }
        return await SecretaryEmail.save(entities);
    }

    public async savePhones(id: number, phones: string[], transaction?: EntityManager): Promise<SecretaryPhone[]> {
        const entities = phones.filter(phone => phone && phone.length > 1).map((number) => {
            const entity = new SecretaryPhone();
            entity.phoneNumber = number;
            entity.user = { id } as SecretaryUser;
            return entity;
        });

        // Previne erro ao tentar salvar uma lista vazia
        if (entities.length === 0) return [];

        if (transaction) {
            return await transaction.getRepository(SecretaryPhone).save(entities);
        }
        return await SecretaryPhone.save(entities);
    }

    public async getById(id: number) {
        return await SecretaryUser.createQueryBuilder('u')
            .leftJoinAndSelect('u.emails', 'emails')
            .leftJoinAndSelect('u.phones', 'phones')
            .where('u.id = :id', { id })
            .getOne();
    }

    public async update(id: number, updateData: any) {
        const secretary = await this.getById(id);
        if (!secretary) throw new Error('Secretaria não encontrada');

        const updatedSecretary = SecretaryUser.merge(secretary, updateData);
        return await SecretaryUser.save(updatedSecretary);
    }
}