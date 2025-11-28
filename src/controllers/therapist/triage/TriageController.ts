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

export default class TriageController {
    public async create(triageJson: TriageJwt) {
        const guardianService = new GuardianService();
        const babyService = new BabyService();
        const triageService = new TriageService();

        triageJson.type = TriageType[triageJson.type as unknown as TriageString];

        triageJson.therapist = { id: triageJson.jwtObject.id } as Therapist;

        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        const manager = queryRunner.manager;
        try {
            triageJson.baby.birthMother = await guardianService.addGuardianToTransaction(triageJson.baby.birthMother, true, manager);
            if(triageJson.baby.guardians){
                triageJson.baby.guardians = await guardianService.bulkCreate(triageJson.baby.guardians, true, manager);
            }

            triageJson.baby = await babyService.create(triageJson.baby, true, manager);

            if(triageJson.indicators){
                triageJson.indicators = triageJson.indicators.map((id) => ({ id: (id as unknown as number) } as Indicator));
            }

            const result = await triageService.create(triageJson as Triage, manager);

            await queryRunner.commitTransaction();

            return { httpStatus: HttpStatus.OK, result };
        }catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
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
