import { HttpStatus } from '../../../helpers/http/AbstractHttpErrors';
import { ResponseHttpController } from '../../../helpers/http/AbstractRoutesTypes';
import { Indicator } from '../../../entity/indicator/Indicator';
import { Therapist } from '../../../entity/therapist/Therapist';
import { Triage, TriageType } from '../../../entity/triage/Triage';
import BabyService from '../../baby/BabyService';
import GuardianService from '../../guardian/GuardianService';
import TriageService from './TriageService';
import { QueryTriageDTO, TriageJwt } from './TriageTypes';
import dataSource from '../../../config/DataSource';
import { EmailService } from '../../../services/EmailService';
import { buildFlowConduct, resolveRiskCategory, shouldUsePeateA } from '../../../helpers/triage/TriageFlowHelper';
import ConductService from '../conduct/ConductService';
import { Conduct } from '../../../entity/conduct/Conduct';
import { Guardian } from '../../../entity/guardian/Guardian';

export default class TriageController {
    public async create(triageJson: TriageJwt) {
        const guardianService = new GuardianService();
        const babyService = new BabyService();
        const triageService = new TriageService();

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

            const selectedIndicatorIds = Array.isArray(triageJson.indicators)
                ? triageJson.indicators.map((indicator: any) => {
                    if (typeof indicator === 'number') return indicator;
                    if (typeof indicator === 'string') return Number(indicator);
                    return Number(indicator?.id);
                })
                : [];

            const selectedIndicators = await Promise.all(
                selectedIndicatorIds.map(async (indicatorId) =>
                    manager.getRepository(Indicator).findOne({ where: { id: indicatorId } })
                )
            );

            const riskCategory = resolveRiskCategory(selectedIndicators.filter(Boolean) as Indicator[]);
            const usesPeateA = shouldUsePeateA(riskCategory);

            triageJson.eoaLeftEar = triageJson.eoaLeftEar ?? triageJson.leftEar;
            triageJson.eoaRightEar = triageJson.eoaRightEar ?? triageJson.rightEar;

            triageJson.eoaLeftEar = String(triageJson.eoaLeftEar) === '1' || triageJson.eoaLeftEar === true;
            triageJson.eoaRightEar = String(triageJson.eoaRightEar) === '1' || triageJson.eoaRightEar === true;

            if (triageJson.peateaLeftEar !== undefined && triageJson.peateaLeftEar !== null) {
                triageJson.peateaLeftEar = String(triageJson.peateaLeftEar) === '1' || triageJson.peateaLeftEar === true;
            }
            if (triageJson.peateaRightEar !== undefined && triageJson.peateaRightEar !== null) {
                triageJson.peateaRightEar = String(triageJson.peateaRightEar) === '1' || triageJson.peateaRightEar === true;
            }

            if (!usesPeateA) {
                triageJson.peateaLeftEar = null;
                triageJson.peateaRightEar = null;
            }

            const flowResult = buildFlowConduct({
                riskCategory,
                testStage: Number(triageJson.testType || 1),
                eoaLeftEar: triageJson.eoaLeftEar as boolean,
                eoaRightEar: triageJson.eoaRightEar as boolean,
                peateaLeftEar: triageJson.peateaLeftEar as boolean | null,
                peateaRightEar: triageJson.peateaRightEar as boolean | null,
            });

            triageJson.leftEar = flowResult.finalLeftEar;
            triageJson.rightEar = flowResult.finalRightEar;

            const conductService = new ConductService();
            const conduct = await conductService.create({
                resultDescription: flowResult.resultDescription,
                accompanyDescription: flowResult.accompanyDescription,
                leftEar: flowResult.finalLeftEar,
                rightEar: flowResult.finalRightEar,
                irda: usesPeateA,
                testType: Number(triageJson.testType || 1),
                therapist: { id: triageJson.jwtObject.id } as Therapist,
            } as Conduct);

            triageJson.conduct = conduct;

            const triageIndicators = selectedIndicators
                .filter(Boolean)
                .map((indicator) => ({ id: indicator!.id } as Indicator));

            const triageToSave = {
                ...triageJson,
                therapist: { id: triageJson.jwtObject.id } as Therapist,
                indicators: triageIndicators,
                type: usesPeateA ? TriageType.PEATEA : TriageType.EOET,
            } as unknown as Triage;

            console.log('TIPO TRIAGEM ANTES DE SALVAR:', triageToSave.type);

            const result = await triageService.create(triageToSave, manager);

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

    public async update(params: any) {
        const triageId = Number(params.id);
        const triageJson = params as TriageJwt;
        
        const guardianService = new GuardianService();
        const babyService = new BabyService();
        const triageService = new TriageService();

        const existingTriage = await triageService.findById(triageId);
        if (!existingTriage) {
            return { httpStatus: HttpStatus.NOT_FOUND, result: { message: "Triagem não encontrada" } };
        }

        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const manager = queryRunner.manager;

        try {
            triageJson.baby.id = existingTriage.baby.id;

            if (triageJson.baby.birthMother) {
                triageJson.baby.birthMother.id = existingTriage.baby.birthMother?.id;
                triageJson.baby.birthMother = await guardianService.addGuardianToTransaction(
                    triageJson.baby.birthMother,
                    true,
                    manager
                );
            }

            if (triageJson.baby.guardians && triageJson.baby.guardians.length > 0) {
                const existingGuardiansIds = existingTriage.baby.guardians?.map(g => g.id) || [];
                triageJson.baby.guardians = await guardianService.bulkCreate(
                    triageJson.baby.guardians.map((g, idx) => ({ ...g, id: existingGuardiansIds[idx] || undefined } as Guardian)),
                    true,
                    manager
                );
            }

            triageJson.baby = await babyService.create(triageJson.baby, true, manager);

            const selectedIndicatorIds = Array.isArray(triageJson.indicators)
                ? triageJson.indicators.map((indicator: any) => {
                    if (typeof indicator === 'number') return indicator;
                    if (typeof indicator === 'string') return Number(indicator);
                    return Number(indicator?.id);
                })
                : [];

            const selectedIndicators = await Promise.all(
                selectedIndicatorIds.map(async (indicatorId) =>
                    manager.getRepository(Indicator).findOne({ where: { id: indicatorId } })
                )
            );

            const riskCategory = resolveRiskCategory(selectedIndicators.filter(Boolean) as Indicator[]);
            const usesPeateA = shouldUsePeateA(riskCategory);

            triageJson.eoaLeftEar = triageJson.eoaLeftEar ?? triageJson.leftEar;
            triageJson.eoaRightEar = triageJson.eoaRightEar ?? triageJson.rightEar;

            triageJson.eoaLeftEar = String(triageJson.eoaLeftEar) === '1' || triageJson.eoaLeftEar === true;
            triageJson.eoaRightEar = String(triageJson.eoaRightEar) === '1' || triageJson.eoaRightEar === true;

            if (triageJson.peateaLeftEar !== undefined && triageJson.peateaLeftEar !== null) {
                triageJson.peateaLeftEar = String(triageJson.peateaLeftEar) === '1' || triageJson.peateaLeftEar === true;
            }
            if (triageJson.peateaRightEar !== undefined && triageJson.peateaRightEar !== null) {
                triageJson.peateaRightEar = String(triageJson.peateaRightEar) === '1' || triageJson.peateaRightEar === true;
            }

            if (!usesPeateA) {
                triageJson.peateaLeftEar = null;
                triageJson.peateaRightEar = null;
            }

            const flowResult = buildFlowConduct({
                riskCategory,
                testStage: Number(triageJson.testType || 1),
                eoaLeftEar: triageJson.eoaLeftEar as boolean,
                eoaRightEar: triageJson.eoaRightEar as boolean,
                peateaLeftEar: triageJson.peateaLeftEar as boolean | null,
                peateaRightEar: triageJson.peateaRightEar as boolean | null,
            });

            triageJson.leftEar = flowResult.finalLeftEar;
            triageJson.rightEar = flowResult.finalRightEar;

            const conductService = new ConductService();
            const conduct = await conductService.create({
                id: existingTriage.conduct.id,
                resultDescription: flowResult.resultDescription,
                accompanyDescription: flowResult.accompanyDescription,
                leftEar: flowResult.finalLeftEar,
                rightEar: flowResult.finalRightEar,
                irda: usesPeateA,
                testType: Number(triageJson.testType || 1),
                therapist: { id: existingTriage.therapist.id } as Therapist,
            } as Conduct);

            triageJson.conduct = conduct;

            const triageIndicators = selectedIndicators
                .filter(Boolean)
                .map((indicator) => ({ id: indicator!.id } as Indicator));

            const triageToSave = {
                ...triageJson,
                id: triageId,
                therapist: { id: existingTriage.therapist.id } as Therapist,
                indicators: triageIndicators,
                type: usesPeateA ? TriageType.PEATEA : TriageType.EOET,
            } as unknown as Triage;

            const result = await triageService.update(triageId, triageToSave, manager);
            await queryRunner.commitTransaction();

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

    public async getById(params: any) {
        const triageService = new TriageService();
        const result = await triageService.findById(Number(params.id));
        return { httpStatus: HttpStatus.OK, result };
    }

    public async triageTypes(): Promise<ResponseHttpController> {
        const triageService = new TriageService();
        const result = await triageService.triageTypes();
        return { httpStatus: HttpStatus.OK, result };
    }
}