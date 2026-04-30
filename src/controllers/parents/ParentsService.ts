import GuardianRepository from '../guardian/GuardianRepository';
import CryptoHelper from '../../helpers/CryptoHelper';
import ParentsRepository from './ParentsRepository';

export default class ParentsService {
    private repository: ParentsRepository;

    constructor() {
        this.repository = new ParentsRepository();
    }

    public async getDashboard() {
        return [];
    }

    public async getTriagesByGuardianId(guardianId: number) {
        return this.repository.getTriagesByGuardianId(guardianId);
    }

    public async getById(id: number) {
        const guardianRepo = new GuardianRepository();
        return guardianRepo.getById(id);
    }

    public async update(id: number, updateData: any) {
        if (updateData.password && updateData.password !== updateData.passwordConfirm) {
            throw new Error('As senhas não coincidem.');
        }

        const guardianRepo = new GuardianRepository();

        if (updateData.password) {
            updateData.password = CryptoHelper.encrypt(updateData.password);
        }
        delete updateData.passwordConfirm;

        if (updateData.emails && typeof updateData.emails === 'object') {
            const rawEmails = Array.isArray(updateData.emails) ? updateData.emails : Object.values(updateData.emails);
            await guardianRepo.saveEmails(id, rawEmails.filter((e: any) => e) as string[]);
            delete updateData.emails;
        }

        if (updateData.phones && typeof updateData.phones === 'object') {
            const rawPhones = Array.isArray(updateData.phones) ? updateData.phones : Object.values(updateData.phones);
            await guardianRepo.savePhones(id, rawPhones.filter((e: any) => e) as string[]);
            delete updateData.phones;
        }

        const guardian = await guardianRepo.getById(id);
        if (!guardian) throw new Error('Responsável não encontrado');

        Object.assign(guardian, updateData);
        return guardianRepo.save(guardian);
    }
}