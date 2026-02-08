import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import { ResponseHttpController } from '../../../helpers/http/AbstractRoutesTypes';
import { Indicator } from '../../../entity/indicator/Indicator';
import { Therapist } from '../../../entity/therapist/Therapist';
import { Triage, TriageString, TriageType } from '../../../entity/triage/Triage';
import BabyService from '../../baby/BabyService';
import GuardianService from '../../guardian/GuardianService';
import TriageService from './TriageService';
import { QueryTriageDTO, TriageJwt } from './TriageTypes';
import dataSource from "../../../config/DataSource";
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
            // 1) Cria/atualiza responsáveis dentro da transação
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

            // 2) Cria o bebê dentro da transação
            triageJson.baby = await babyService.create(triageJson.baby, true, manager);

            // 3) Normaliza indicadores
            if (triageJson.indicators) {
                triageJson.indicators = triageJson.indicators.map(
                    (id) => ({ id: (id as unknown as number) } as Indicator)
                );
            }

            // 4) Cria a triagem
            const result = await triageService.create(triageJson as Triage, manager);

            // 5) Commit (garante que dados foram persistidos)
            await queryRunner.commitTransaction();

            // 6) ✅ Envia e-mail para responsáveis APÓS commit
            try {
                const getMainEmail = (emails: any) => {
                    if (!Array.isArray(emails) || emails.length === 0) return null;
                    const first = emails[0];
                    // suporta ["a@b.com"] e [{ email: "a@b.com" }]
                    return typeof first === "string" ? first : first?.email;
                };

                const sendWelcomeIfHasEmail = async (guardian: any) => {
                    const email = getMainEmail(guardian?.emails);
                    if (!email) return;
                    await EmailService.sendWelcomeEmail(email, guardian?.name || "Responsável");
                };

                // Mãe
                await sendWelcomeIfHasEmail(triageJson.baby.birthMother);

                // Outros responsáveis
                if (Array.isArray(triageJson.baby.guardians)) {
                    for (const g of triageJson.baby.guardians) {
                        await sendWelcomeIfHasEmail(g);
                    }
                }
            } catch (mailError) {
                console.error("Erro ao enviar e-mails de boas-vindas (responsáveis):", mailError);
            }

            return { httpStatus: HttpStatus.OK, result };
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