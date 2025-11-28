import AbstractRoutes from '../../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../../helpers/http/AbstractRoutesTypes';
import { Equipment } from '../../../entity/equipment/Equipment';
import { ValidatorBoolean } from '../../../helpers/validator/ValidatorBoolean';
import { ValidatorDate } from '../../../helpers/validator/ValidatorDate';
import { ValidatorNumber } from '../../../helpers/validator/ValidatorNumber';
import { ValidatorObject } from '../../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../../helpers/validator/ValidatorRequest';
import { ValidatorString } from '../../../helpers/validator/ValidatorString';
import EquipmentController from './EquipmentController';
import { QueryEquipmentDTO } from './EquipmentTypes';

export default class EquipmentRoutes extends AbstractRoutes {
    private equipmentController: EquipmentController;

    constructor() {
        super();
        this.equipmentController = new EquipmentController();

        this.create();
        this.deleteOne();
        this.getAll();
    }

    private create(): void {
        const config: RouteConfig = {
            description: 'Endpoint para criar um equipamento',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [
                new ValidatorString('brand').withDescription('marca').required(true),
                new ValidatorDate('dateOfLastCalibration').withDescription('data da ultima calibração').required(true),
                new ValidatorString('model').withDescription('modelo').required(true),
            ]).withDescription('Equipment').required(true)),
            path: '/',
            withJWT: true
        };
        this.addRoute<Equipment>(config, this.equipmentController.create);
    }

    public getAll(): void {
        const config: RouteConfig = {
            description: 'Endpoint para pegar todos os equipamentos',
            method: 'get',
            params: new ValidatorRequest(undefined, new ValidatorObject('query', [
                new ValidatorString('brand').withDescription('marca').required(false),
                new ValidatorDate('dateOfLastCalibration').withDescription('data da ultima calibração').required(false),
                new ValidatorBoolean('listAllActives').withDescription('listar todos os ativos').required(false),
                new ValidatorString('model').withDescription('modelo').required(false),
            ]).required(false).withDescription('Equipment')),
            path: '/',
            withJWT: true
        };
        this.addRoute<QueryEquipmentDTO>(config, this.equipmentController.getAll);
    }

    private deleteOne(): void {
        const config: RouteConfig = {
            description: 'Endpoint para deletar um equipamento',
            method: 'delete',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id',
            withJWT: true
        };
        this.addRoute<{id: number}>(config, this.equipmentController.deleteOne);
    }

}
