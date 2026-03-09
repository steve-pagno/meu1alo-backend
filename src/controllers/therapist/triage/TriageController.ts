import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import { ResponseHttpController } from '../../../helpers/http/AbstractRoutesTypes';
import { Indicator } from '../../../entity/indicator/Indicator';
import { Therapist } from '../../../entity/therapist/Therapist';
import { Triage, TriageString, TriageType } from '../../../entity/triage/Triage';
import BabyService from '../../baby/BabyService';
import GuardianService from '../../guardian/GuardianService';
import TriageService from './TriageService';
import { QueryTriageDTO, TriageJwt } from './TriageTypes';
import dataSource from '../../../config/DataSource';
import { EmailService } from '../../../services/EmailService';

export default class TriageController {
    public async create(triageJson: TriageJwt) {
        const guardianService = new GuardianService();
        const babyService = new BabyService();
        const triageService = new TriageService();

        triageJson.type = TriageType[triageJson.type as unknown as TriageString];
        triageJson.therapist = { id: triageJson.jwtObject.id } as Therapist;

        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const manager = queryRunner.manager;

        try {
            triageJson.baby.birthMother = await guardianService.addGuardianToTransaction(
                triageJson.baby.birthMother,
                true,
                manager
            );

            if (triageJson.baby.guardians) {
                triageJson.baby.guardians = await guardianService.bulkCreate(
                    triageJson.baby.guardians,
                    true,
                    manager
                );
            }

            triageJson.baby = await babyService.create(triageJson.baby, true, manager);

            if (triageJson.indicators) {
                triageJson.indicators = triageJson.indicators.map(
                    (id) => ({ id: (id as unknown as number) } as Indicator)
                );
            }

            const result = await triageService.create(triageJson as Triage, manager);

            await queryRunner.commitTransaction();

            try {
                const getMainEmail = (emails: any) => {
                    if (!Array.isArray(emails) || emails.length === 0) return null;
                    const first = emails[0];
                    return typeof first === 'string' ? first : first?.email;
                };

                const sendAccountIfGenerated = async (guardian: any) => {
                    if (!guardian?.__isNewGuardian) return;

                    const email = getMainEmail(guardian?.emails);
                    const plainPassword = guardian?.__generatedPasswordPlain;
                    const login = guardian?.cpf || guardian?.__generatedLogin;

                    if (!email || !plainPassword || !login) return;

                    await EmailService.sendGuardianAccountEmail(
                        email,
                        guardian?.name || 'Responsável',
                        login,
                        plainPassword
                    );
                };

                await sendAccountIfGenerated(triageJson.baby.birthMother);

                if (Array.isArray(triageJson.baby.guardians)) {
                    for (const g of triageJson.baby.guardians) {
                        await sendAccountIfGenerated(g);
                    }
                }
            } catch (mailError) {
                console.error('Erro ao enviar e-mails de conta dos responsáveis:', mailError);
            }

            return { httpStatus: HttpStatus.CREATED, result };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    public async getAll(params: QueryTriageDTO) {
        const triageService = new TriageService();
        const result = await triageService.getAll(params);
        return { httpStatus: HttpStatus.OK, result };
    }

    public async triageTypes(): Promise<ResponseHttpController> {
        const triageService = new TriageService();
        const result = await triageService.triageTypes();
        return { httpStatus: HttpStatus.OK, result };
    }
}