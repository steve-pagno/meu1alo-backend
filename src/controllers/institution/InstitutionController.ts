import { HttpStatus } from '../../helpers/http/AbstractHttpErrors';
import { Institution } from '../../entity/institution/Institution';
import { InstitutionUser } from '../../entity/institution/InstitutionUser';
import UserService from '../users/UserService';
import InstitutionService from './InstitutionService';
import dataSource from '../../config/DataSource';
import { EmailService } from '../../services/EmailService';

export default class InstitutionController {
    public async create(institutionUser: any) {
        const institutionService = new InstitutionService();
        const userService = new UserService();

        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const manager = queryRunner.manager;

        try {
            if (!institutionUser.institution.id) {
                const institution = await institutionService.create(institutionUser.institution, manager);
                institutionUser.institution = { id: institution.id } as Institution;
            }

            const result = await userService.save<InstitutionUser>('institution', institutionUser, manager);

            result.emails = await institutionService.saveEmails(
                result.id,
                institutionUser.emails as unknown as string[],
                manager
            );

            result.phones = await institutionService.savePhones(
                result.id,
                institutionUser.phones as unknown as string[],
                manager
            );

            await queryRunner.commitTransaction();

            // ✅ Envia para o e-mail principal (NÃO para login)
            try {
                const mainEmail =
                    Array.isArray(result.emails) && result.emails.length > 0
                        ? (result.emails[0] as any).email ?? result.emails[0]
                        : null;

                if (mainEmail) {
                    await EmailService.sendWelcomeEmail(
                        mainEmail,
                        result.name || institutionUser.name || 'Responsável Institucional'
                    );
                } else {
                    console.warn('[WELCOME_EMAIL] Instituição sem email principal; não foi possível enviar.');
                }
            } catch (mailError) {
                console.error('Erro ao enviar e-mail de boas-vindas (instituição):', mailError);
            }

            return { httpStatus: HttpStatus.OK, result };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    public async getOne(params: { id: number }) {
        const institutionService = new InstitutionService();
        const result = await institutionService.findOneById(params.id);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getAll() {
        const institutionService = new InstitutionService();
        const result = await institutionService.findAll();
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getDashboard() {
        const institutionService = new InstitutionService();
        const result = await institutionService.getDashboard();
        return { httpStatus: HttpStatus.OK, result };
    }

    public async getInstitutionTypes() {
        const institutionService = new InstitutionService();
        const result = await institutionService.getInstitutionTypes();
        return { httpStatus: HttpStatus.OK, result };
    }
}